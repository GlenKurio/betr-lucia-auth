import Elysia, { t } from "elysia";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const streamRoutes = new Elysia({ prefix: "/stream" }).post(
  "/message",
  async ({ body: { message }, set }) => {
    set.headers["Content-Type"] = "text/event-stream";
    set.headers["Cache-Control"] = "no-cache";
    set.headers["Connection"] = "keep-alive";
    const stream = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `${message}` },
      ],
      model: "gpt-4o-mini",
      stream: true,
    });
    // for await (const chunk of stream) {
    //   process.stdout.write(chunk.choices[0]?.delta?.content || "");
    // }
    // console.log(stream.toReadableStream());
    return stream.toReadableStream();
  },
  {
    body: t.Object({
      message: t.String(),
    }),
  }
);

export { streamRoutes };

// import { Elysia, t } from "elysia";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const streamRoutes = new Elysia({ prefix: "/stream" }).post(
//   "/message",
//   async ({ body: { message }, set }) => {
//     set.headers["Content-Type"] = "text/event-stream";
//     set.headers["Cache-Control"] = "no-cache";
//     set.headers["Connection"] = "keep-alive";

//     const stream = await openai.chat.completions.create({
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: `${message}` },
//       ],
//       model: "gpt-4-0613", // Make sure to use a valid model name
//       stream: true,
//     });

//     return new ReadableStream({
//       async start(controller) {
//         for await (const chunk of stream) {
//           const content = chunk.choices[0]?.delta?.content || "";
//           if (content) {
//             controller.enqueue(`data: ${JSON.stringify({ content })}\n\n`);
//           }
//         }
//         controller.close();
//       },
//     });
//   },
//   {
//     body: t.Object({
//       message: t.String(),
//     }),
//   }
// );

// export { streamRoutes };
