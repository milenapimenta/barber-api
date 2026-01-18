import { Module } from '@nestjs/common';
import { BarbershopsService } from './barbershops.service';
import { BarbershopsController } from './barbershops.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [BarbershopsController],
  providers: [BarbershopsService],
})
export class BarbershopsModule {}
