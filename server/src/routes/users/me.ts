import Elysia from "elysia";
import { authGuard } from "../auth/authGuard";

const me = new Elysia().use(authGuard).get("/me", ({ user }) => {
  return user;
});

export { me };
