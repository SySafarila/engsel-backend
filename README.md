# NodeJs Backend

This is a backend project with Express JS

## Endpoints:

### Login

`POST` /auth/login

Request body:

```json
{
  "email": "super.admin@admin.com",
  "password": "password"
}
```

### Register

`POST` /auth/register

Request body:

```json
{
  "email": "test@test.com",
  "password": "password",
  "name": "test",
  "username": "test"
}
```

### Updating User

`PATCH` /auth/me

`Authorization` Bearer [your-token]

```json
{
  "email": "testing.update@gmail.com",
  "password": "password2",
  "name": "name name",
  "username": "password2"
}
```

### Get Current User

`GET` /auth/me

`Authorization` Bearer [your-token]
