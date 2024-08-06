import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { usersTable } from "./user";

export const messagesTable = sqliteTable("messages", {
  id: text("id").notNull().primaryKey(),
  isUserMessage: integer("is_user_message").notNull().default(1),
  messageType: text("message_type").notNull().default("text"),
  createdAt: integer("created_at")
    .notNull()
    .$default(() => new Date().getTime()),
  updatedAt: integer("updated_at")
    .notNull()
    .$default(() => new Date().getTime()),
  text: text("text").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
});
