import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['email', 'username', 'password'] as const),
) {
  @ApiProperty({ type: String, required: true })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
