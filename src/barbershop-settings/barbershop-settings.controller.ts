import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarbershopSettingsService } from './barbershop-settings.service';
import { CreateBarbershopSettingDto } from './dto/create-barbershop-setting.dto';
import { UpdateBarbershopSettingDto } from './dto/update-barbershop-setting.dto';

@Controller('barbershop-settings')
export class BarbershopSettingsController {
  constructor(private readonly barbershopSettingsService: BarbershopSettingsService) {}

  @Post()
  create(@Body() createBarbershopSettingDto: CreateBarbershopSettingDto) {
    return this.barbershopSettingsService.create(createBarbershopSettingDto);
  }

  @Get()
  findAll() {
    return this.barbershopSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barbershopSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarbershopSettingDto: UpdateBarbershopSettingDto) {
    return this.barbershopSettingsService.update(+id, updateBarbershopSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barbershopSettingsService.remove(+id);
  }
}
