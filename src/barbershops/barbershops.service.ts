import { Inject, Injectable } from '@nestjs/common';
import { CreateBarbershopDto } from './dto/create-barbershop.dto';
import { UpdateBarbershopDto } from './dto/update-barbershop.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import Redis from 'ioredis';
import { REDIS } from 'src/redis/redis.provider';
import { CACHE_KEYS } from 'src/cache/cache.keys';

@Injectable()
export class BarbershopsService {
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) { }

  async create(createBarbershopDto: CreateBarbershopDto) {
    const barberShop = await this.prisma.barbershop.create({
      data: createBarbershopDto,
    });

    await this.redis.del(CACHE_KEYS.barbershops);

    return barberShop;
  }

  async findAll() {
    try {
      const cachedBarbershops = await this.redis.get(CACHE_KEYS.barbershops);

      if (cachedBarbershops) {
        return JSON.parse(cachedBarbershops);
      }

      const barbershops = await this.prisma.barbershop.findMany();

      await this.redis.set(
        CACHE_KEYS.barbershops,
        JSON.stringify(barbershops),
        'EX',
        60,
      );

      return barbershops;
    } catch (error) {
      return this.prisma.barbershop.findMany();
    }
  }

  async findOne(id: string) {
    const cachedKey = CACHE_KEYS.barbershop(id);

    try {
      const cachedBarbershop = await this.redis.get(cachedKey);

      if (cachedBarbershop) {
        return JSON.parse(cachedBarbershop);
      }

      const barbershop = await this.prisma.barbershop.findUnique({
        where: { id },
      });

      if (barbershop) {
        await this.redis.set(cachedKey, JSON.stringify(barbershop), 'EX', 60);
      }

      return barbershop;
    } catch (error) {
      return this.prisma.barbershop.findUnique({
        where: { id },
      });
    }
  }

  async update(id: string, updateBarbershopDto: UpdateBarbershopDto) {
    const barbershop = await this.prisma.barbershop.update({
      where: { id },
      data: updateBarbershopDto,
    });

    await this.redis.del(CACHE_KEYS.barbershop(id));

    await this.redis.del(CACHE_KEYS.barbershops);

    const users = await this.prisma.user.findMany({
      where: { barbershopId: id },
      select: { id: true },
    });

    const userCacheKeys = users.map(
      (u) => `user:${u.id}`,
    );

    if (userCacheKeys.length) {
      await this.redis.del(...userCacheKeys);
    }

    await this.redis.del(CACHE_KEYS.users);

    return barbershop;
  }

  async remove(id: string) {
    const users = await this.prisma.user.findMany({
      where: { barbershopId: id },
      select: { id: true },
    });

    await this.prisma.barbershop.delete({
      where: { id },
    });

    await this.redis.del(CACHE_KEYS.barbershop(id));
    await this.redis.del(CACHE_KEYS.barbershops);

    const userCacheKeys = users.map((u) => CACHE_KEYS.user(u.id));

    if (userCacheKeys.length) {
      await this.redis.del(...userCacheKeys);
    }

    await this.redis.del(CACHE_KEYS.users);

    return { success: true };
  }
}
