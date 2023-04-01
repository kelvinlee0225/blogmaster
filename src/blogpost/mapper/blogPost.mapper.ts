import { Blogpost } from '../blogpost.entity';
import { BlogPostDto } from '../dto';

export class BlogPostMapper {
  static mapToDto(entity: Blogpost) {
    const dto = new BlogPostDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.body = entity.body;
    dto.user = {
      id: entity.user.id,
      username: entity.user.username,
      email: entity.user.email,
      userType: entity.user.userType,
    };

    return dto;
  }

  static mapToDtoArray(entities: Blogpost[]) {
    return entities.map(this.mapToDto);
  }
}
