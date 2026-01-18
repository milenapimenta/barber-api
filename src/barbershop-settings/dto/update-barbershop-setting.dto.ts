import { PartialType } from '@nestjs/mapped-types';
import { CreateBarbershopSettingDto } from './create-barbershop-setting.dto';

export class UpdateBarbershopSettingDto extends PartialType(CreateBarbershopSettingDto) {}
