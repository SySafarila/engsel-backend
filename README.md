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

Request body:

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

### Create Permission

`PUT` /permissions

`Authorization` Bearer [your-token]

Request body:

```json
{
  "name": "article-read"
}
```

### Read Permissions

`GET` /permissions

`Authorization` Bearer [your-token]

### Update Permission

`PATCH` /permissions

`Authorization` Bearer [your-token]

Request body:

```json
{
  "name": "article-read",
  "new_name": "article-read-new"
}
```

### Delete Permission

`DELETE` /permissions

`Authorization` Bearer [your-token]

Request body:

```json
{
  "name": "article-read"
}
```

### Create Role

`PUT` /roles

`Authorization` Bearer [your-token]

Request body:

```json
{
  "name": "basic-user",
  "level": 5, // lowest is higher
  "permissions": ["article-read"]
}
```

### Read Role

`GET` /roles

`Authorization` Bearer [your-token]

### Update Role

`PATCH` /roles

`Authorization` Bearer [your-token]

Request body:

```json
{
  "name": "basic-user",
  "new_name": "basic-user-new",
  "new_level": 5, // lowest is higher
  "permissions": ["article-read", "article-create"]
}
```

### Delete Role

`DELETE` /roles

`Authorization` Bearer [your-token]

Request body:

```json
{
  "name": "basic-user"
}
```

### Read Users

`GET` /users

### Read User Detail

`GET` /users/[username]

### Charge Donation To User

`POST` /users/[username]/donate

Request body:

```json
{
  "amount": 10000,
  "donator_name": "Syahrul Safarila",
  "message": "Hello world!",
  "payment_method": "bca-virtual-account", // "bca-virtual-account" or "qris"
  "donator_email": "sysafarila@gmail.com"
}
```

### Read Donations

`GET` /donations

`Authorization` Bearer [your-token]

### Read Transaction Detail

`GET` /transactions/[transactionId]

### Replay donation

`POST` /donations/replay

`Authorization` Bearer [your-token]

Request body:

```json
{
  "transaction_id": "xxx-xxx-xxx"
}
```
