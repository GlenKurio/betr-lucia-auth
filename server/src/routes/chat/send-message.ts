import Elysia, { t } from "elysia";
import { authGuard } from "../auth/authGuard";
import OpenAI from "openai";
import { InternalServerErrorException } from "../../plugins/error/exceptions";
import { db } from "../../db";
import { messagesTable } from "../../db/schema/message";
import { nanoid } from "../../lib/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const sendMessage = new Elysia().post(
  "/messages",
  async ({ body: { message }, set }) => {
    set.headers["Cache-Control"] = "no-cache";

    try {
      const thread = await openai.beta.threads.create();
      console.log(thread.id);
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
      });

      const userMessage = await db.insert(messagesTable).values({
        id: nanoid(),
        isUserMessage: 1,
        messageType: "text",
        text: message,
        userId: "mx0drvgd8ad6qdb",
      });

      const stream = openai.beta.threads.runs.stream(thread.id, {
        assistant_id: "asst_0HDM3Sgicyciio4WRwmIGiYd",
      });

      stream.on("textDone", async (text) => {
        await db.insert(messagesTable).values({
          id: nanoid(),
          isUserMessage: 0,
          messageType: "text",
          text: text.value,
          userId: "mx0drvgd8ad6qdb",
        });
      });

      return stream.toReadableStream();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  },
  {
    body: t.Object({ message: t.String() }),
  }
);

export { sendMessage };
