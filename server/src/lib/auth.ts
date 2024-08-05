import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "../db";
import { sessionsTable } from "../db/schema/session";
import { usersTable } from "../db/schema/user";

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  getUserAttributes: (attributes) => {
    return {
      profilePicture: attributes.profilePicture,
      name: attributes.name,
      email: attributes.email,
    };
  },
});
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  name?: string;
  profilePicture?: string;
  email: string;
}
