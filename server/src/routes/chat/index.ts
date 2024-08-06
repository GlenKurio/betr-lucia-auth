import Elysia from "elysia";
import { getMessages } from "./get-messages";
import { authGuard } from "../auth/authGuard";
import { sendMessage } from "./send-message";

const chatRoutes = new Elysia({ prefix: "/chat" })
  .use(getMessages)
  .use(sendMessage);

export { chatRoutes };
