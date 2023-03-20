import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signUp(@Body() createUserDto: UserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  async signIn(@Body() dto: { username: string; password: string }) {
    return await this.userService.signIn(dto.username, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }
}
