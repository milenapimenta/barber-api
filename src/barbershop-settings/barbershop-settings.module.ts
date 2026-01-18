import { Module } from '@nestjs/common';
import { BarbershopSettingsService } from './barbershop-settings.service';
import { BarbershopSettingsController } from './barbershop-settings.controller';

@Module({
  controllers: [BarbershopSettingsController],
  providers: [BarbershopSettingsService],
})
export class BarbershopSettingsModule {}
