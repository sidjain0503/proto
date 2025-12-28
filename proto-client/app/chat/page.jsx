"use client";

import { useState, useRef, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import aiService from "@/lib/Services/AIService";
import MarkdownMessage from "@/components/shared/MarkdownMessage";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Remove any in-flight assistant placeholder before streaming.
      setMessages((prev) =>
        prev.filter((msg) => !(msg.role === "assistant" && msg.content === ""))
      );

      // Add a placeholder assistant message for streaming
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      // Streaming callback updates the last assistant message
      const response = await aiService.generate(userMessage, (token) => {
        setMessages((prev) => {
          // Find last assistant message and append token
          const lastIndex = prev.length - 1;
          if (lastIndex < 0 || prev[lastIndex].role !== "assistant") return prev;
          const newMessages = [...prev];
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + token,
          };
          return newMessages;
        });
      });

      // If response has additional content at the end, update last assistant message
      if (response && (response.content || response.message || response.text)) {
        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          if (lastIndex < 0 || prev[lastIndex].role !== "assistant") return prev;
          let newContent = "";
          if (typeof response === "string") {
            newContent = response;
          } else if (response.content) {
            newContent = response.content;
          } else if (response.message) {
            newContent = response.message;
          } else if (response.text) {
            newContent = response.text;
          } else {
            newContent = JSON.stringify(response);
          }
          const newMessages = [...prev];
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newContent,
          };
          return newMessages;
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle>AI Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start a conversation by typing a message below.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                     <MarkdownMessage content={message.content} />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="border-t p-4">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
