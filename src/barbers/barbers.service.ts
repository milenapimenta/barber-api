import { Inject, Injectable } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { REDIS } from 'src/redis/redis.provider';
import Redis from 'ioredis';
import { CACHE_KEYS } from 'src/cache/cache.keys';

@Injectable()
export class BarbersService {
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) { }

  async create(createBarberDto: CreateBarberDto) {
    const barbers = await this.prisma.barber.create({
      data: createBarberDto,
    });

    await this.redis.del(CACHE_KEYS.barbers);

    return barbers;
  }

  async findAll() {
    try {
      const cachedBarbers = await this.redis.get(CACHE_KEYS.barbers);
      if (cachedBarbers) {
        return JSON.parse(cachedBarbers);
      }

      const barbers = await this.prisma.barber.findMany(
        {
          include: {
            barbershop: true,
          },
        },
      );

      await this.redis.set(
        CACHE_KEYS.barbers,
        JSON.stringify(barbers),
        'EX',
        60,
      );

      return barbers;
    } catch (error) {
      return await this.prisma.barber.findMany(
        {
          include: {
            barbershop: true,
          },
        },
      );
    }
  }

  async findOne(id: string) {
    const cacheKey = CACHE_KEYS.barber(id);

    try {
      const cachedBarber = await this.redis.get(cacheKey)

      if (cachedBarber) {
        return JSON.parse(cachedBarber);
      }

      const barber = await this.prisma.barber.findUnique({
        where: {
          id,
        },
        include: {
          barbershop: true,
        },
      });

      if (barber) {
        await this.redis.set(
          cacheKey,
          JSON.stringify(barber),
          'EX',
          60,
        );
      }

      return barber;
    } catch (error) {
      return await this.prisma.barber.findUnique({
        where: {
          id,
        },
        include: {
          barbershop: true,
        },
      });
    }
  }

  async update(id: string, updateBarberDto: UpdateBarberDto) {
    const barber = await this.prisma.barber.update({
      where: {
        id,
      },
      data: updateBarberDto,
    });

    await this.redis.del(CACHE_KEYS.barbers);
    await this.redis.del(CACHE_KEYS.barber(id));

    return barber;
  }

  async remove(id: string) {
    await this.prisma.barber.delete({
      where: {
        id,
      },
    });

    await this.redis.del(CACHE_KEYS.barbers);
    await this.redis.del(CACHE_KEYS.barber(id));

    return { success: true }
  }
}
