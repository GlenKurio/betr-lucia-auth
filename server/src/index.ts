import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { error } from "./plugins/error";
import { protectedRoutes } from "./routes/protected";
import { streamRoutes } from "./routes/ai-stream";
import { chatRoutes } from "./routes/chat";
import { api } from "./api";

export const app = new Elysia()
  .use(
    cors({
      origin: ["localhost:3000", "localhost:5173"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(swagger())
  .use(api)
  .get("/", () => {
    return { message: "Hello, world!" };
  })
  .use(error)
  .listen(process.env.PORT || 3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
