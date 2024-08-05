import Elysia from "elysia";
import { dashboard } from "./dashboard";
import { authGuard } from "../auth/authGuard";

const protectedRoutes = new Elysia({ prefix: "/protected" })
  .use(authGuard)
  .use(dashboard);

export { protectedRoutes };
