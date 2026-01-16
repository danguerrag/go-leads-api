import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  date?: Date;
}
