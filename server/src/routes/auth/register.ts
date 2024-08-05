import { password as bunPassword } from "bun";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { generateId } from "lucia";
// import { alphabet, generateRandomString } from "oslo/crypto";
import { db } from "../../db";
import { usersTable } from "../../db/schema/user";
import { lucia } from "../../lib/auth";
import {
  ConflictException,
  InternalServerErrorException,
} from "../../plugins/error/exceptions";
const register = new Elysia().post(
  "/register",
  async ({ body: { email, password, name }, cookie, set }) => {
    try {
      const existingUser = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          name: usersTable.name,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (existingUser.length > 0) {
        throw new ConflictException("User already exists.");
      }

      const userId = generateId(15);

      // can laso use salt but need to save it in db
      //   const passwordSalt = generateRandomString(
      //     16,
      //     alphabet("a-z", "A-Z", "0-9")
      //   );
      const passwordPepper = process.env.PASSWORD_PEPPER!;
      const hashedPassword = await bunPassword.hash(passwordPepper + password);

      const newUser = await db.insert(usersTable).values({
        id: userId,
        name: name,
        email: email,
        hashedPassword: hashedPassword,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      set.status = 201;

      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      return { message: "User created successfully", userId: newUser };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  },
  {
    body: t.Object({
      email: t.String({
        format: "email",
      }),
      password: t.String(),
      name: t.String(),
    }),
  }
);

export { register };
