import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { createContext, useRef, useState } from "react";

import { AssistantStream } from "openai/lib/AssistantStream.mjs";
import { toast } from "sonner";
import { SelectMessage } from "@server/db/schema/message";
import { app } from "@/lib/server-endpoint";

// TODO: how to pass message type from backend to frontend ?
type MessagesData = {
  messages: SelectMessage[];
  nextCursor?: string | null;
};

interface Props {
  children: React.ReactNode;
}

type ContextResponse = {
  handleSubmit: () => void;
  userInput: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<ContextResponse>({
  handleSubmit: () => {},
  userInput: "",
  handleInputChange: () => {},
  isLoading: false,
});

export const ChatContextProvider = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backupUserInput = useRef("");
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      // const response = await fetch("http://localhost:3000/chat/messages", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ message }),
      // });
      const { data, error } = await app.api.chat.messages.post({ message });

      // if (!response.ok) {
      //   toast.error(`An error occurred: ${response.statusText}`);
      // }

      if (error) {
        toast.error(`An error occurred: ${error}`);
      }

      // return AssistantStream.fromReadableStream(response.body!);
      return AssistantStream.fromReadableStream(data!);
    },
    onMutate: async ({ message }) => {
      backupUserInput.current = message;
      setUserInput("");

      await queryClient.cancelQueries({ queryKey: ["messages"] });

      const previousMessages = queryClient.getQueryData<
        InfiniteData<MessagesData>
      >(["messages"]);

      if (!previousMessages) return;

      queryClient.setQueryData<InfiniteData<MessagesData>>(
        ["messages"],
        (old) => {
          if (!old) return { pages: [], pageParams: [] };
          let newPages = [...old.pages];
          let latestPage = newPages[0]!;

          if (!latestPage) {
            latestPage = { messages: [] };
            newPages = [latestPage];
          }

          latestPage.messages = [
            {
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: 1,
              messageType: "text",
              userId: "user",
            },
            ...latestPage.messages,
          ];
          newPages[0] = latestPage;
          // console.log("New Optimistic Update Pages:", newPages);
          return {
            ...old,
            pages: newPages,
          };
        }
      );
      // console.log("Previous Messages:", previousMessages);

      setIsLoading(true);
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    onSuccess: async (stream) => {
      if (!stream) {
        return toast.error(
          "Having troubles with sending this message. Refresh the page and try one more time."
        );
      }
      // stream.on("runStepCreated", (step) => {
      //   console.log("RUN STEP CREATED: ", step);
      // });
      // stream.on("toolCallCreated", (toolCall) => {
      //   console.log("TOOL CALL  CREATED: ", toolCall);
      // });
      // HANDLE EVENTS THAT REQUIRE ACTIONS
      stream.on("event", (event) => {
        // console.log("EVENT: ", event);
        // console.log("RUN ID: ", event.data?.id);

        if (event.event === "thread.run.requires_action")
          toast("Thread run requires action");
        if (event.event === "thread.run.completed")
          toast("Thread run completed");
      });

      // HANDLE TEXT STREAMING
      stream.on("textDelta", (delta) => {
        setIsLoading(false);
        if (delta.value != null) {
          queryClient.setQueryData<InfiniteData<MessagesData>>(
            ["messages"],
            (old) => {
              if (!old) return { pages: [], pageParams: [] };
              const isAiResponseCreated = old.pages.some((page) =>
                page.messages.some((message) => message.id === "ai-response")
              );
              const updatedPages = old.pages.map((page) => {
                if (page === old.pages[0]) {
                  let updatedMessages;

                  if (!isAiResponseCreated) {
                    updatedMessages = [
                      {
                        createdAt: new Date().getTime(),
                        id: "ai-response",
                        text: delta.value ?? "",
                        isUserMessage: 0,
                        messageType: "text",
                        updatedAt: new Date().getTime(),
                        userId: "ai",
                      },
                      ...page.messages,
                    ];
                  } else {
                    updatedMessages = page.messages.map((message) => {
                      if (message.id === "ai-response" && delta.value) {
                        return {
                          ...message,
                          text: message.text + delta.value,
                        };
                      }
                      return message;
                    });
                  }

                  return { ...page, messages: updatedMessages };
                }
                return page;
              });
              return { ...old, pages: updatedPages };
            }
          );
        }
      });
    },

    onError: async (err, newMessage, context) => {
      setUserInput(backupUserInput.current);

      queryClient.setQueryData(["messages"], context?.previousMessages);

      setIsLoading(false);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const handleSubmit = () => sendMessage({ message: userInput });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        handleSubmit,
        userInput,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
