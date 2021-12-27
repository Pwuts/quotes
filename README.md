~~Nuxt 3 Minimal Starter~~ QuoteDB
==================================
Started for use in a friend group, this project is both a very minimal quote DB and a nice PoC for Nuxt3 + Prisma with an API and JWT authentication.

## ToDo
- [x] API
  - [x] Database schema
  - [x] Quote CRUD
  - [x] Users
    - [x] Login
    - [x] Invite & register
- [ ] User interface
  - [ ] List quotes
  - [ ] Log in & register
  - [ ] Profile
  - [ ] Invite
  - [ ] Edit quotes
- [ ] Complete README
- [ ] Docker configuration

## Use
The database does not contain any data out of the box. You also don't need an invite token to create the first user account.

## API
The API is used internally, but may also be used by 3rd party applications.

### Endpoints
| Method   | Endpoint         | Auth | Description
| -------- | ---------------- | ---- | -----------
| `GET`    | `/quotes`        | 🔍  | Lists all quotes if authenticated; only public quotes otherwise
| `GET`    | `/quotes/:id`    | 🔍  | Returns quote referenced by `:id` (if public or authenticated)
| `POST`   | `/quotes`        | 🔒  | Creates a new quote
| `POST`   | `/quotes/:id`    | 🔒  | Updates the quote referenced by `:id`
| `DELETE` | `/quotes/:id`    | 🔏  | Deletes the quote referenced by `:id`
| `GET`    | `/user`          | 🔒  | Returns the profile of the authenticated user
| `POST`   | `/user/login`    | ❌  | Verifies the received credentials and returns a JWT token if successful
| `POST`   | `/user/register` | ❌  | Creates an account using an invite token; returns a JWT token if successful
| `GET`    | `/user/invite`   | 🔒  | Creates an invite token (up to 5 per user)

### Auth
The API uses `Bearer` authentication with JWT tokens.
The table below explains the authentication/authorization indications in the [endpoints](#endpoints) table.
| Icon | Authorization                 |
| ---- | ----------------------------- |
| 🔒  | Only authenticated access      |
| 🔏  | Only author can perform action |
| 🔍  | Partial unauthenticated access |
| ❌  | Only unauthenticated access    |


## Wanna help?
We recommend to look at the [documentation](https://v3.nuxtjs.org).

### Setup
1. Install dependencies
    ```bash
    yarn install
    ```

2. Copy `example.env` -> `.env` and make changes where necessary.

3. To create/update the database schema, run Prisma migrate:
    ```bash
    npx prisma migrate dev
    ```

### Development
Start the development server on http://localhost:3000
```bash
yarn dev
```

### Production
Build the application for production:
```bash
yarn build
```

In the production environment, also don't forget to run migrations:
```bash
npx prisma migrate deploy
```

Check out the [deployment documentation](https://v3.nuxtjs.org/docs/deployment).
