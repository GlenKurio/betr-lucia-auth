import Elysia from "elysia";
import { streamRoutes } from "./routes/ai-stream";
import { authRoutes } from "./routes/auth";
import { chatRoutes } from "./routes/chat";
import { protectedRoutes } from "./routes/protected";
import { userRoutes } from "./routes/users";
export const api = new Elysia({
  prefix: "/api",
})
  .use(authRoutes)
  .use(userRoutes)
  .use(chatRoutes)
  .use(protectedRoutes)
  .use(streamRoutes);
