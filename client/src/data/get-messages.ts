// import { currentUser } from "@/lib/auth";
import { INFINITE_QUERY_LIMIT } from "@/lib/constants/infinite-query";
import { db } from "@/lib/db";
interface Props {
  pageParam: string | null;
}
export async function getMessages({ pageParam }: Props) {
  try {
    const user = await currentUser();
    const limit = INFINITE_QUERY_LIMIT!;
    console.log(threadId);
    if (!user || !user.id) throw new Error("Unauthorized");
    const cursor = pageParam;
    const messages = await db.message.findMany({
      take: limit + 1,
      where: {
        userId: user.id,
        threadId,
      },
      orderBy: {
        createdAt: "desc",
      },

      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        isUserMessage: true,
        messageType: true,
        createdAt: true,
        text: true,
        threadId: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;

    if (messages.length > limit) {
      const nextItem = messages.pop();

      nextCursor = nextItem?.id;
    }

    return {
      messages,
      nextCursor,
    };
  } catch (error) {
    throw new Error("Not found");
  }
}
