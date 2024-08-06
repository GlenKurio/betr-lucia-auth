import Elysia, { t } from "elysia";
import { authGuard } from "../auth/authGuard";
import { INFINITE_QUERY_LIMIT } from "../../lib/constants";
import {
  InternalServerErrorException,
  UnauthorizedException,
} from "../../plugins/error/exceptions";
import { db } from "../../db";
import { messagesTable } from "../../db/schema/message";
import { and, desc, eq, gt, lt } from "drizzle-orm";

const getMessages = new Elysia().use(authGuard).get(
  "/messages",
  async ({ body: { pageParam }, user }) => {
    try {
      const limit = INFINITE_QUERY_LIMIT!;

      if (!user || !user.id) throw new UnauthorizedException();
      const cursor = pageParam;
      const messages = await db
        .select()
        .from(messagesTable)
        .where(
          and(
            eq(messagesTable.userId, user.id),
            cursor ? gt(messagesTable.id, cursor) : undefined
          )
        )
        .orderBy(desc(messagesTable.createdAt))
        .limit(limit + 1);

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
      console.log(error);
      throw new InternalServerErrorException();
    }
  },
  {
    body: t.Object({ pageParam: t.Optional(t.String()) }),
  }
);

export { getMessages };
