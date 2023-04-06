import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Request,
  Patch,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { ISPUBLIC } from '../common/decorator';
import { UserType } from './enums/user-type-enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ISPUBLIC()
  @Post()
  async signUp(@Body() createUserDto: UserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiBearerAuth('access-token')
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @ApiBearerAuth('access-token')
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const foundUser = await this.findOneById(updateUserDto.id);

    if (foundUser.id === req.user.id || req.user.userType === UserType.ADMIN)
      return await this.userService.update(updateUserDto);

    throw new ForbiddenException({
      statusCode: 403,
      message:
        'Forbidden. You have the be the author of the account or an admin.',
    });
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const foundUser = await this.findOneById(id);

    if (foundUser.id === req.user.id || req.user.userType === UserType.ADMIN)
      return await this.userService.delete(id);

    throw new ForbiddenException({
      statusCode: 403,
      message:
        'Forbidden. You have the be the author of the account or an admin.',
    });
  }
}
