import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class InitiateCallDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  number: string;
}
