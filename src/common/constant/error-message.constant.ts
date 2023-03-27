export const isAuthorOrAdminError = (entityName: string) =>
  `Forbidden. You have to be the author of this ${entityName} or an Admin`;
