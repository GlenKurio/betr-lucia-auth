import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { error } from "./plugins/error";
import { protectedRoutes } from "./routes/protected";
import { streamRoutes } from "./routes/ai-stream";

export const app = new Elysia()
  .use(
    cors({
      origin: "localhost:3000",
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(swagger())
  .use(authRoutes)
  .use(userRoutes)
  .use(protectedRoutes)
  .use(streamRoutes)
  .get("/", () => {
    return { message: "Hello, world!" };
  })
  .use(error)
  .listen(process.env.PORT || 3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
