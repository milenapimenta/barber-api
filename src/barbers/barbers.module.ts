import { Module } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarbersModule {}
