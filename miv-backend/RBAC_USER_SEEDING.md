# RBAC User Seeding

## Run with Docker

From the `miv-backend` directory:

```bash
docker compose up --build
```

The local services will be available at:

- Payload app: `http://localhost:3001`
- Payload admin: `http://localhost:3001/admin`
- MongoDB: `mongodb://localhost:27017/payload`

## Run the Seed Script

Once the containers are up and the Payload app is running:

```bash
docker compose exec payload-cms npm run seed:rbac-users
```

The script is idempotent:

- existing users are detected by email and skipped
- missing users are created
- the script logs whether each account already existed or was newly created

## Seeded Test Credentials

All seeded test users use the password `changeme123`.

- `admin1@test.com` → `admin`
- `analyst1@test.com` → `miv_analyst`
- `founder1@test.com` → `founder`

## Verify It Worked

You can verify in either of these ways:

1. Check the script output for `Created user` or `Existing user` log lines.
2. Sign in at `http://localhost:3001/admin` with `admin1@test.com` / `changeme123`.
3. Open the Users collection in the Payload admin UI and confirm the three test users are present with the expected roles.

## Assumptions and Limitations

- The script uses the existing Payload local API and expects the standard project `.env` file to be available to the `payload-cms` container.
- The users collection has `auth: true`, so Payload handles password hashing and auth account creation automatically when users are created through the local API with a `password` field.
- The same RBAC users are also seeded on Payload startup through `onInit`, using the same helper as the manual script.
