import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BarbershopsModule } from './barbershops/barbershops.module';
import { BarbershopSettingsModule } from './barbershop-settings/barbershop-settings.module';
import { BarbersModule } from './barbers/barbers.module';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    BarbershopsModule,
    BarbershopSettingsModule,
    BarbersModule,
    ClientsModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
