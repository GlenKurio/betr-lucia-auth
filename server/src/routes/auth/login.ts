import Elysia, { t } from "elysia";
import { db } from "../../db";
import { usersTable } from "../../db/schema/user";
import { eq } from "drizzle-orm";
import { password as bunPassword } from "bun";
import { lucia } from "../../lib/auth";
import {
  InternalServerErrorException,
  NotFoundException,
} from "../../plugins/error/exceptions";
const login = new Elysia().post(
  "/login",
  async ({ body: { email, password }, cookie, set }) => {
    try {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (user.length === 0 || user[0].hashedPassword === null) {
        throw new NotFoundException();
      }
      const passwordPepper = process.env.PASSWORD_PEPPER!;
      const passwordValid = await bunPassword.verify(
        passwordPepper + password,
        user[0].hashedPassword
      );
      console.log();
      if (!passwordValid) {
        throw new NotFoundException();
      }

      const session = await lucia.createSession(user[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      set.status = 200;

      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  },
  {
    body: t.Object({
      email: t.String({
        format: "email",
      }),
      password: t.String(),
    }),
  }
);

export { login };
