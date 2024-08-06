// import { useStreamableText } from "@/lib/hooks/use-streamable-text";

import { PiUserCircleFill } from "react-icons/pi";
import { PulseLoader } from "react-spinners";

import { PiPencilSimpleFill } from "react-icons/pi";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

// import { MessageType } from "@prisma/client";
// import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

import { SelectMessage } from "@server/db/schema/message";

interface MessageProps {
  message: SelectMessage;
  isNextMessageSamePerson: boolean;
  messageType: string;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({ message }, ref) => {
  // const user = useCurrentUser();
  return (
    <div
      ref={ref}
      className={cn("flex items-end", {
        "justify-end": message.isUserMessage === 1,
      })}
    >
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": message.isUserMessage === 1,
          "order-2 items-start": message.isUserMessage === 0,
        })}
      >
        {message.isUserMessage === 1 ? (
          <UserMessage>{message.text}</UserMessage>
        ) : message.isUserMessage === 0 && message.messageType === "LOADING" ? (
          <LoadingMessage />
        ) : message.isUserMessage === 0 ? (
          <AssistantMessage content={message.text} />
        ) : null}
      </div>
    </div>
  );
});

Message.displayName = "Message";

export default Message;

export function UserMessage({ children }: { children: React.ReactNode }) {
  const user = {
    image: "/Korben_Dallas.webp",
  };
  return (
    <div className="max-w-full group">
      <div className="flex max-w-full items-end justify-end">
        <div className=" flex aspect-square h-5 w-5 flex-shrink-0 items-center justify-center lg:h-8 lg:w-8 order-2 rounded-full bg-white overflow-hidden ">
          <Avatar className="h-5 w-5 md:h-8 md:w-8">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>
              <PiUserCircleFill className="h-full w-full text-stone-600" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mx-1 flex max-w-[300px] md:max-w-[400px] lg:max-w-[600px] space-x-2 text-base md:mx-2 order-1 items-start">
          {/* TODO: add edit user message functionality */}
          <Button
            variant={"ghost"}
            size={"xs"}
            className=" hover:bg-primary/40 rounded-full invisible group-hover:visible"
          >
            <PiPencilSimpleFill className="h-4 w-4 text-stone-600" />
          </Button>

          <div className="inline-block rounded-lg px-2 py-2 shadow-md md:px-4 bg-white text-stone-800 w-full md:prose-md prose prose-sm lg:prose-lg ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
export function AssistantMessage({ content }: { content: string }) {
  {
    /* TODO: add message actions functionality ??? */
  }
  return (
    <div className="max-w-full">
      <div className="flex max-w-full items-end justify-start">
        <div className="flex aspect-square h-6 w-6 flex-shrink-0 items-center justify-center lg:h-9 lg:w-9 order-1 rounded-full overflow-hidden">
          <Icons.logo className="h-10 w-10 fill-zinc-300" />
        </div>
        <div className="mx-1 flex max-w-[300px] md:max-w-[400px] lg:max-w-[600px] flex-col space-y-2 text-base md:mx-2  order-1 items-end">
          <div className="inline-block rounded-lg px-2 py-2 shadow-md md:px-4 bg-white text-stone-800 w-full md:prose-md prose prose-sm lg:prose-lg">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssistantCard({
  children,
  text,
}: {
  children: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="max-w-full bg-primary/10">
      <div className="flex max-w-full items-end justify-start">
        <div className="flex aspect-square h-6 w-6 flex-shrink-0 items-center justify-center lg:h-9 lg:w-9 order-1 rounded-full overflow-hidden">
          <Icons.logo className="h-10 w-10 fill-zinc-300" />
        </div>
        <div className="mx-1 flex flex-col space-y-2 text-base md:mx-2  order-1 ">
          <p>{text}</p>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
export function LoadingMessage() {
  return (
    <div>
      <div className="max-w-full">
        <div className="flex max-w-full items-end justify-start">
          <div className=" flex aspect-square h-6 w-6 flex-shrink-0 items-center justify-center lg:h-8 lg:w-8 order-1 rounded-full  overflow-hidden">
            <Icons.logo className="h-10 w-10 fill-zinc-300" />
          </div>
          <div className="mx-1 flex max-w-[300px] md:max-w-[400px] lg:max-w-[600px] flex-col space-y-2 text-base md:mx-2  order-1 items-end">
            <div className="inline-block rounded-lg px-2 py-2 shadow-md md:px-4 bg-white text-stone-800 w-full md:prose-md prose prose-sm lg:prose-lg">
              <span className="flex h-full items-center justify-center">
                <PulseLoader color="#E87B35" size="8px" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
