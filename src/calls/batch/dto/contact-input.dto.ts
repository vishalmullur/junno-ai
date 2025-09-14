import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class ContactInputDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
