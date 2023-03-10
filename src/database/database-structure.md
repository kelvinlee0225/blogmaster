@startuml

object Users {
Id: uuid
Email: varchar
Username: varchar
Password: varchar
UserType: RolesEnum
CreatedAt: timestamptz
UpdatedAt: timestamptz
DeletedAt: timestamptz
}

enum RolesEnum {
Blogger
Admin
}

object BlogPosts {
Id: uuid
UserId: uuid
Title: varchar
Body: varchar
CreatedAt: timestamptz
UpdatedAt: timestamptz
DeletedAt: timestamptz
}

object Comments {
Id: uuid
UserId: uuid
BlogId: uuid
ParentId: uuid
Description: varchar
CreatedAt: timestamptz
UpdatedAt: timestamptz
DeletedAt: timestamptz
}

Users ||--|{ BlogPosts
Users ||--|{ Comments
BlogPosts ||--|{ Comments
RolesEnum ||--|{ Users

@enduml
