# Blogmaster
This repository contains a basic blog API built with [NestJs](https://nestjs.com/) and PostgreSQL. The API uses TypeORM to interact with the database, Swagger UI for the documentation, which contains an UI presentation of the APIs is user friendly and easy to understand, Jest provided by NestJS out of the box for Unit Testing, and [Passport](https://www.passportjs.org/) for authentication and authorization.

## Installation

```bash
$ yarn install
```

## Database
The database is PostgreSQL. First, create a database through any administration and development platform of your choice and create a `.env` file with the properties as indicated in the `.env.example` from the `root` directory. Assigning values to the mentioned keys in the `.env` file according to the database you created, we can now establish a connection with the database and run the following command to create tables in it: 

`yarn migration:run`

If you ever want to Drop all the existing tables in the database, use: 

`yarn schema:drop`

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

To be able to access the Swagger documentation, browse to: 
```bash
http://localhost:3000/swagger
```
**Kind reminder**: Swagger UI provides a way to authorize in the top left corner after you log in and get your access token. This is important, since some of the endpoints requires authentication before to be called.

## Test
Unit tests can be easily ran by using the following command

```bash
# unit tests
$ yarn test
```
This next command can show the coverage of the unit tests for each entity

```bash
# test coverage
$ yarn test:cov
```

