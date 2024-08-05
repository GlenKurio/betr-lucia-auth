import Elysia from "elysia";
import { lucia } from "../../lib/auth";
import {
  BadRequestException,
  InternalServerErrorException,
} from "../../plugins/error/exceptions";

const logout = new Elysia().post(
  "/logout",
  async ({ cookie, set, redirect }) => {
    const sessionCookie = cookie[lucia.sessionCookieName];

    if (!sessionCookie?.value) {
      throw new BadRequestException("Session not found");
    }

    await lucia.invalidateSession(sessionCookie.value);
    const blankSessionCookie = lucia.createBlankSessionCookie();

    sessionCookie.set({
      value: blankSessionCookie.value,
      ...blankSessionCookie.attributes,
    });

    // return redirect("/login", 302);
    return { message: "Logged out" };
  }
);
export { logout };
