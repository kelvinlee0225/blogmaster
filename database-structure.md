@startuml

object Users {
Id: uuid
Email: varchar
Username: varchar
Password: varchar
UserType: UserTypeEnum
CreatedAt: timestampz
UpdatedAt: timestampz
DeletedAt: timestampz
}

enum UserTypeEnum {
Blogger
Admin
}

object Blogs {
Id: uuid
UserId: uuid
Title: varchar
Description: varchar
CreatedAt: timestampz
UpdatedAt: timestampz
DeletedAt: timestampz
}

object Comments {
Id: uuid
UserId: uuid
BlogId: uuid
ParentId: uuid
Description: varchar
CreatedAt: timestampz
UpdatedAt: timestampz
DeletedAt: timestampz
}

Users ||--|{ Blogs
Users ||--|{ Comments
Blogs ||--|{ Comments
UserTypeEnum ||--|{ Users

@enduml
