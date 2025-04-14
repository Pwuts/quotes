# QuoteDB

Started for use in a friend group, this project is both a very minimal quote DB and a nice PoC for Nuxt3 + Prisma with an API and JWT authentication.

## ToDo

- [x] API
  - [x] Database schema
  - [x] Quote CRUD
  - [x] Users
    - [x] Login
    - [x] Invite & register
- [x] User interface
  - [x] List quotes
  - [x] Log in & register
  - [x] Profile
  - [x] Invite
  - [x] Edit quotes
- [ ] Complete README
- [x] Docker configuration
- [ ] Unbodge
  - [ ] Use native store instead of bodged cookie store for state persistence
  - [ ] ~~Make a proper API client~~

## Use

The database does not contain any data out of the box. You also don't need an invite token to create the first user account.

## API

The API is used internally, but may also be used by 3rd party applications.

### Endpoints

| Method   | Endpoint         | Auth | Description                                                                 |
| -------- | ---------------- | ---- | --------------------------------------------------------------------------- |
| `GET`    | `/quotes`        | 🔍   | Lists all quotes if authenticated; only public quotes otherwise             |
| `GET`    | `/quotes/:id`    | 🔍   | Returns quote referenced by `:id` (if public or authenticated)              |
| `POST`   | `/quotes`        | 🔒   | Creates a new quote                                                         |
| `POST`   | `/quotes/:id`    | 🔒   | Updates the quote referenced by `:id`                                       |
| `DELETE` | `/quotes/:id`    | 🔏   | Deletes the quote referenced by `:id`                                       |
| `GET`    | `/user`          | 🔒   | Returns the profile of the authenticated user                               |
| `POST`   | `/user/login`    | ❌   | Verifies the received credentials and returns a JWT token if successful     |
| `POST`   | `/user/register` | ❌   | Creates an account using an invite token; returns a JWT token if successful |
| `GET`    | `/user/invite`   | 🔒   | Creates an invite token (up to 5 per user)                                  |

### Auth

The API uses `Bearer` authentication with JWT tokens.
The table below explains the authentication/authorization indications in the [endpoints](#endpoints) table.
| Icon | Authorization |
| ---- | ----------------------------- |
| 🔒 | Only authenticated access |
| 🔏 | Only author can perform action |
| 🔍 | Partial unauthenticated access |
| ❌ | Only unauthenticated access |

## Wanna help?

First of all, check out the Nuxt 3 [documentation](https://nuxt.com/docs).

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
   In order for this to work, the configured database user needs permission to connect and to query and alter tables.

### Development

Start the development server on http://localhost:3000

```bash
yarn dev
```

### Test build

Build the application for production:

```bash
yarn build
```

You can also test migrations in production mode using:

```bash
npx prisma migrate deploy
```

Again, the configured database user needs to have permission to alter the DB schema in order for Prisma to work.

## Deployment on Docker

The docker configuration in this repository is made for the following environment:

- An `nginx-proxy` (with `acme-companion`) container handles incoming HTTP traffic and certificates, and is reachable via a docker network named `web`.
- A Postgres database is reachable via a docker network named `postgres`; its URL and credentials for it are set in the `DATABASE_URL` variable in `.env`.  
  The specified database user needs to be able to connect and to alter the database schema.
- The `JWT_SECRET` is set in `.env`.

Of course you can deviate from this if you want to run this project yourself.

On startup, the container runs migrations and then starts the server.
