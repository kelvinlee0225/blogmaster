import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class BaseDto {
  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  deletedAt?: Date;
}
