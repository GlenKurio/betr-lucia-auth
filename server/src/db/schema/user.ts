import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  profilePicture: text("profile_picture"),
  hashedPassword: text("hashed_password"),
});
