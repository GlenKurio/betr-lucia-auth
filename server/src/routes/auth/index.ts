import Elysia from "elysia";
import { login } from "./login";

import { register } from "./register";
import { logout } from "./logout";

const authRoutes = new Elysia({ prefix: "/auth" })
  .use(register)
  .use(login)
  .use(logout);

export { authRoutes };
