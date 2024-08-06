import { app } from "@/lib/server-endpoint";

export async function getMessages(pageParam?: string) {
  try {
    const { data, error } = await app.chat.messages.get({
      pageParam,
    });

    if (error) {
      throw new Error("Failed to fetch messages");
    }

    return {
      messages: data.messages,
      nextCursor: data.nextCursor,
    };
  } catch (error) {
    console.log("ERROR: ", error);
    throw new Error("Failed to fetch messages");
  }
}
