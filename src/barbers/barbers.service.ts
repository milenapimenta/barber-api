import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { REDIS } from 'src/redis/redis.provider';
import Redis from 'ioredis';
import { CACHE_KEYS } from 'src/cache/cache.keys';
import { Prisma } from '@prisma/client';

@Injectable()
export class BarbersService {
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) { }

  async create(dto: CreateBarberDto) {
    const barbershopExists = await this.prisma.barbershop.findUnique({
      where: { id: dto.barbershopId },
      select: { id: true },
    });

    if (!barbershopExists) {
      throw new BadRequestException('Barbershop não existe');
    }

    try {
      const barber = await this.prisma.barber.create({
        data: dto,
      });

      await this.redis.del(CACHE_KEYS.barbers);

      return barber;
    } catch (error) {
      this.handlePrismaErrors(error);
    }
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

  private handlePrismaErrors(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const field = (error.meta?.target as string[])?.[0];

        if (field === 'phone') {
          throw new ConflictException('Telefone já está em uso');
        }

        throw new ConflictException('Registro duplicado');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Registro não encontrado');
      }
    }

    throw error;
  }
}
