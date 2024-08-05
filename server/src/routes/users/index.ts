import Elysia from "elysia";
import { me } from "./me";

const userRoutes = new Elysia({ prefix: "/users" }).use(me);

export { userRoutes };
