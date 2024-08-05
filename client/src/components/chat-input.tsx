"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useRef } from "react";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import { ChatContext } from "./chat-context";

export default function ChatInput() {
  const { userInput, handleInputChange, handleSubmit, isLoading } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="w-full flex-shrink-0 flex justify-center items-center ">
      <div className="flex w-full max-w-[900px] flex-col items-center gap-4 pb-2 pt-2 max-sm:px-2 md:flex-row md:pb-8">
        {/* TODO: add "add attachement" funtionality to prompt assistant with Image / Photo */}
        <div className="w-full">
          <Textarea
            placeholder="Ask Artichef about something..."
            rows={1}
            maxRows={2}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            ref={textareaRef}
            disabled={isLoading}
            onChange={handleInputChange}
            value={userInput}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                if (!userInput.trim()) return;
                handleSubmit();
                textareaRef.current?.focus;
              }
            }}
            className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrolbar-w-2 scrolling-touch resize-none py-3 text-base"
          />
        </div>
        <Button
          aria-label="send message"
          size="lg"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-3 text-base font-semibold text-white md:w-1/5"
          onClick={() => {
            if (!userInput.trim()) return;
            handleSubmit();
            textareaRef.current?.focus();
          }}
        >
          Ask <PiPaperPlaneTiltFill className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
