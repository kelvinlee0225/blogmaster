import { UserDto } from '../dto';
import { User } from '../user.entity';

export class UserMapper {
  static mapToDto(entity: User, withPassword?: boolean) {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.username = entity.username;
    dto.userType = entity.userType;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    if (withPassword) dto.password = entity.password;
    return dto;
  }

  static mapToDtoArray(entities: User[]) {
    return entities.map((entity) => this.mapToDto(entity));
  }
}
