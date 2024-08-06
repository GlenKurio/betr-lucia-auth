import Elysia from "elysia";
import { getMessages } from "./get-messages";
import { authGuard } from "../auth/authGuard";

const chatRoutes = new Elysia({ prefix: "/chat" }).use(getMessages);

export { chatRoutes };
