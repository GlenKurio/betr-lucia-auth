import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { PiChatsCircleFill } from "react-icons/pi";
import { ChatContext } from "./chat-context";
import { getMessages } from "@/data/get-messages";
import { useIntersectionObserver } from "usehooks-ts";

export default function ChatMessages() {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["messages"],
    queryFn: ({ pageParam }) => getMessages({ pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage?.nextCursor ?? null,
  });
  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  const loadingMessage = {
    createdAt: new Date(),
    id: `loading`,
    isUserMessage: false,
    messageType: "LOADING",
    text: "loading text message",
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage]);

  return (
    <>
      {isLoading ? (
        <div>Loading Messages...</div>
      ) : messages && messages.length > 0 ? (
        <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-full max-w-[100vw] flex-1 flex-col-reverse overflow-y-auto overflow-x-hidden border-zinc-200 ">
          <div className="h-fill flex flex-1 flex-col gap-8 justify-end w-full max-w-[900px] mx-auto pb-8 pt-8 max-sm:px-2">
            {combinedMessages.map((message) => (
              <div key={message.id}>{message.text}</div>
            ))}
          </div>
        </div>
      ) : (
        // TODO: Add Loading state skeleton ?
        <div className="flex flex-1 flex-col items-center justify-center gap-2 h-full">
          <PiChatsCircleFill className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-500">
            Ask your first question to get started.
          </p>
          {/* TODO: add quick start buttons */}
        </div>
      )}
    </>
  );
}
