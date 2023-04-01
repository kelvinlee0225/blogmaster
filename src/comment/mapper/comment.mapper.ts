import { Comment } from '../comment.entity';
import { CommentDto } from '../dto';

export class CommentMapper {
  static mapToDto(entity: Comment) {
    const dto = new CommentDto();
    dto.id = entity.id;
    dto.body = entity.body;
    dto.blogPostId = entity.blogPostId || entity.blogPost.id;

    if (!!entity.parent)
      dto.parent = {
        id: entity.parent.id,
        body: entity.parent.body,
      };
    else dto.parentId = entity.parentId;

    if (!!entity.user)
      dto.user = {
        id: entity.user.id,
        username: entity.user.username,
        email: entity.user.email,
        userType: entity.user.userType,
      };
    else dto.userId = entity.userId;

    return dto;
  }

  static mapToDtoArray(entities: Comment[]) {
    return entities.map(this.mapToDto);
  }
}
