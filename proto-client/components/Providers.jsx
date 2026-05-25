"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { AppStoreProvider } from "@/contexts/Store";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppStoreProvider>{children}</AppStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
