import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBarberDto {
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'barbershopId é obrigatório' })
  barbershopId: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
