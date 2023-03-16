import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(UserDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
