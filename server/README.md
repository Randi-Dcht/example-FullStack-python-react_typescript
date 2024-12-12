# Backend of the project

## Description
This is the backend of the project. 
It is an API that provides the data for the frontend.
This is a flask application that uses a postgresql database to store the data.

## Object Model
1. User
    - id (primary key)
    - username
    - password (hashed)
    - email
    - role (admin, customer, worker)

2. Customer
    - id (primary key)
    - user_id (foreign key)
    - postal_code
    - city
    - country
    - phone
    - street

3. Product
    - id (primary key)
    - name
    - description
    - price
    - stock
    - picture
    - tva

4. Command
    - id (primary key)
    - user_id (foreign key)
    - date
    - status (creation, waiting, cancellation, finish)
    - description

5. CommandProduct
    - id (primary key)
    - command_id (foreign key)
    - product_id (foreign key)
    - quantity


## Structure internal

model -> service -> controller -> routes

## Installation


```bash
$ ./docker.sh
```

## Environment variables

```bash
$ cp .env.example .env
```

example of .env file:
```text
DATABASE_URI=
JWT_SECRET_KEY=
STATIC_FOLDER=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
```


## Endpoints

- /api/account (POST, GET, DELETE, PUT)
- /api/account/<int:userId>/<string:action> (PUT)
- /api/login (POST)
- /api/signup (POST)


- /api/product (GET, POST, PUT)
- /api/product/<int:productId> (DELETE)
- /api/product/image/<int:productid> (POST)


- /api/command (GET, POST)
- /api/command/<int:commandId> (DELETE)
- /api/command/<int:commandId>/<string:action> (PUT)