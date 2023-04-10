import { UserDto } from '../dto';
import { User } from '../user.entity';

export class UserMapper {
  static mapToDto(entity: User) {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.userType = entity.userType;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    return dto;
  }

  static mapToDtoArray(entities: User[]) {
    return entities.map(this.mapToDto);
  }
}
