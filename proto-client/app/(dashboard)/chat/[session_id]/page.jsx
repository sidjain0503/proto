"use client";

import { useState, useRef, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, PencilIcon, Home, FileText } from "lucide-react";
import aiService from "@/lib/Services/AIService";
import MessageService from "@/lib/Services/MessageService";
import MarkdownMessage from "@/components/shared/MarkdownMessage";
import { useParams } from "next/navigation";
import { useAppStore } from "@/contexts/Store";
import { ModelService } from "@/lib/Services";

const sessionItem = [
  {
    section: "Navigations",
    items: [
      {
        title: "Home",
        url: "/",
        icon: Home,
      },
      {
        title: "New Chat",
        url: "/chat",
        icon: PencilIcon,
      },
    ],
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { menuItems } = require("@/app/menu");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { setMenuItem } = useAppStore();
  const { session_id } = useParams();

  const getAllMessages = async () => {
    const messages = await MessageService.getAllMessages({
      filters: { session_id },
    });
    setMessages(messages);
  };

  const getAllSessions = async () => {
    setMenuItem([]);
    const allservices = await ModelService.fetchModel("session");
    const history = {
      section: "History",
      items: allservices.map((item) => ({
        id: item.id,
        title: item.title || "New Chat",
        url: `/chat/${item.id}`,
        icon: Send,
      })),
    };
    let sessionItems = [...sessionItem]
    sessionItems.push(history);
    console.log('sessionItems',sessionItems)
    setMenuItem(sessionItems);

  };

  useEffect(() => {
    getAllSessions();
    getAllMessages();

    return () => {
      setMenuItem(menuItems);
    };
  }, []);

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
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Streaming callback updates the last assistant message
      const response = await aiService.generate(
        session_id,
        [{ role: "user", content: userMessage }],
        (token) => {
          setMessages((prev) => {
            // Find last assistant message and append token
            const lastIndex = prev.length - 1;
            if (lastIndex < 0 || prev[lastIndex].role !== "assistant")
              return prev;
            const newMessages = [...prev];
            newMessages[lastIndex] = {
              ...newMessages[lastIndex],
              content: newMessages[lastIndex].content + token,
            };
            return newMessages;
          });
        }
      );

      // If response has additional content at the end, update last assistant message
      if (response && (response.content || response.message || response.text)) {
        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          if (lastIndex < 0 || prev[lastIndex].role !== "assistant")
            return prev;
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
      // Re-fetch messages to get metadata (RAG sources) persisted by backend
      await getAllMessages();
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
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Powered by AI Chain Engine (auto-detects RAG when documents are uploaded)
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Execution Active
              </span>
            </div>
          </div>
        </div>
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
                  <p className="text-xs text-muted-foreground mt-2">
                    This chat is powered by the Basic Chat Chain execution
                    system.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => {
                const meta = message.metadata
                  ? typeof message.metadata === "string"
                    ? JSON.parse(message.metadata)
                    : message.metadata
                  : null;
                const sources = meta?.sources;

                return (
                  <div key={index}>
                    <div
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
                    {sources?.length > 0 && (
                      <div className="flex justify-start mt-2 ml-1">
                        <div className="max-w-[80%] space-y-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Sources used:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sources.map((src, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 text-xs bg-muted/60 border rounded-md px-2.5 py-1.5"
                                title={src.preview}
                              >
                                <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium truncate max-w-[140px]">
                                  {src.documentTitle}
                                </span>
                                <span className="text-muted-foreground">
                                  chunk {src.chunkIndex + 1}
                                </span>
                                <span className="text-muted-foreground">
                                  ({(src.score * 100).toFixed(0)}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
