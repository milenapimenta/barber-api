import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import Redis from 'ioredis';
import { REDIS } from 'src/redis/redis.provider';
import { CACHE_KEYS } from 'src/cache/cache.keys';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    await this.redis.del(CACHE_KEYS.users);

    return user;
  }

  async findAll() {
    try {
      const cachedUsers = await this.redis.get(CACHE_KEYS.users);

      if (cachedUsers) {
        return JSON.parse(cachedUsers);
      }

      const users = await this.prisma.user.findMany(
        {
          include: {
            barbershop: true,
          }
        }
      );

      await this.redis.set(
        CACHE_KEYS.users,
        JSON.stringify(users),
        'EX',
        60,
      );

      return users;
    } catch (error) {
      return this.prisma.user.findMany();
    }
  }

  async findOne(id: string) {
    const cacheKey = CACHE_KEYS.user(id);

    try {
      const cachedUser = await this.redis.get(cacheKey);

      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (user) {
        await this.redis.set(cacheKey, JSON.stringify(user), 'EX', 60);
      }

      return user;
    } catch (error) {
      return this.prisma.user.findUnique({
        where: { id },
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    await this.redis.del(CACHE_KEYS.users);
    await this.redis.del(CACHE_KEYS.user(id));

    return user;
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    await this.redis.del(CACHE_KEYS.users);
    await this.redis.del(CACHE_KEYS.user(id));

    return { success: true };
  }
}
