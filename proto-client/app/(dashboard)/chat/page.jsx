"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, PencilIcon, Home, FolderIcon } from "lucide-react";
import { useAppStore } from "@/contexts/Store";
import { ChatService, ModelService } from "@/lib/Services";
import { menuItems } from "@/app/menu";

const sessionItem= [
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
      {
        title: "Document",
        url: "/documents",
        icon: FolderIcon,
      },
    ],
  },
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { setMenuItem } = useAppStore();
  const router = useRouter();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);

    try {
      // Create a new session
      const session = await ChatService.createNewChat();
      const sessionId = session?.data?.id;
      if (!sessionId) throw new Error("Failed to create session.");

      // Fetch all session history
      const allSessions = await ModelService.fetchModel("session");
      const sessionHistory = {
        section: "History",
        items: allSessions.map((item) => ({
          title: item.title || "New Chat",
          url: `/chat/${item.id}`,
          icon: Send,
        })),
      };
      const sideNav = [...sessionItem, sessionHistory];
      setMenuItem(sideNav);

      // Redirect to newly created session
      router.push(`/chat/${sessionId}`);
    } catch (error) {
      // Handle error as you wish
      console.error(error.message || "Failed to create chat session.");
    } finally {
      setLoading(false);
    }
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

    return () => {
      setMenuItem(menuItems);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto h-screen">
      <div className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2 w-full px-4">
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
  );
}
