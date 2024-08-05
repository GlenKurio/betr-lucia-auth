# betr-lucia

1. install dependencies:

```bash
bun add lucia @lucia-auth/adapter-drizzle @elysiajs/cookie @libsql/client drizzle-orm

bun add -D drizzle-kit

```

2. Setup Turso databse with drizzle and adapter for lucia:

- Login to Turso, and create a db in the closest location:

```bash
turso auth login
turso db create drizzle-turso-db
turso db show drizzle-turso-db
turso db tokens create drizzle-turso-db
```

- Setup DB locally with Turso for development:

```bash
turso dev --db-file dev.db
```

- Create schemas for user and session;
- Migrate db using drizzle-kit:

```bash
bunx drizzle-kit generate
bunx drizzle-kit push
```

3. Create Lucia instance with drizzle adapter in lib/auth.ts
