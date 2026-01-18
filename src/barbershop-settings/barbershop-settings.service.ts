import { Injectable } from '@nestjs/common';
import { CreateBarbershopSettingDto } from './dto/create-barbershop-setting.dto';
import { UpdateBarbershopSettingDto } from './dto/update-barbershop-setting.dto';

@Injectable()
export class BarbershopSettingsService {
  create(createBarbershopSettingDto: CreateBarbershopSettingDto) {
    return 'This action adds a new barbershopSetting';
  }

  findAll() {
    return `This action returns all barbershopSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} barbershopSetting`;
  }

  update(id: number, updateBarbershopSettingDto: UpdateBarbershopSettingDto) {
    return `This action updates a #${id} barbershopSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} barbershopSetting`;
  }
}
