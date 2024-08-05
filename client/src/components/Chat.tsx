import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

export default function ChatComponent() {
  return (
    <div className="h-full flex flex-col">
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
