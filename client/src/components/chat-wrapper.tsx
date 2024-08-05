import { ChatContextProvider } from "./chat-context";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

const ChatWrapper = () => {
  return (
    <ChatContextProvider>
      <div
        className="flex flex-col  min-h-screen
       bg-zinc-0 divide-y divide-zinc-200"
      >
        <ChatMessages />
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
