
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import { REDIS } from 'src/redis/redis.provider';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInAuthDto } from './dto/signin-auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(REDIS) private readonly redis: Redis,
  ) { }

  private loginAttemptsKey(email: string) {
    return `auth:login_attempts:${email}`;
  }

  // async signup(data: SignUpDto) {
  //     const company = await this.prismaService.company.create({
  //         data: {
  //             name: data.companyName,
  //             cnpj: data.cnpj,
  //             phone: data.phone,
  //             email: data.email,
  //             address: data.address,
  //         },
  //     });

  //     const user = await this.usersService.create(company.id, {
  //         name: data.name,
  //         email: data.email,
  //         password: data.password,
  //         role: 'ADMIN',
  //     });

  //     return {
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //     };
  // }

  // async signin(data: SignInAuthDto) {

  //     const key = this.loginAttemptsKey(data.email);

  //     const attempts = Number(await this.redis.get(key)) || 0;

  //     if (attempts >= 5) {
  //         throw new UnauthorizedException(
  //             'Too many login attempts. Try again later.',
  //         );
  //     }

  //     const user = await this.prismaService.user.findUnique({
  //         where: {
  //             email: data.email
  //         }
  //     });

  //     if (!user || !(await bcrypt.compare(data.password, user.password))) {
  //         await this.redis.multi()
  //             .incr(key)
  //             .expire(key, 600)
  //             .exec();

  //         throw new UnauthorizedException('Invalid credentials');
  //     }

  //     await this.redis.del(key);

  //     const accessToken = await this.jwtService.signAsync({
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //     });

  //     return { accessToken };
  // }

  // async logout(token: string) {
  //     const payload = this.jwtService.decode(token) as { exp: number };

  //     const ttl = payload.exp - Math.floor(Date.now() / 1000);

  //     await this.redis.set(
  //         `auth:blacklist:${token}`,
  //         '1',
  //         'EX',
  //         ttl,
  //     );
  // }

  // async getProfile(userId: number) {
  //     const cacheKey = this.profileCacheKey(userId);

  //     const cachedProfile = await this.redis.get(cacheKey);
  //     if (cachedProfile) {
  //         return JSON.parse(cachedProfile);
  //     }

  //     const user = await this.usersService.findOne(userId);

  //     const profile = {
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //     };

  //     await this.redis.set(
  //         cacheKey,
  //         JSON.stringify(profile),
  //         'EX',
  //         60,
  //     );

  //     return profile;
  // }

  private profileCacheKey(userId: number) {
    return `auth:profile:${userId}`;
  }
}
