"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { AppStoreProvider } from "@/contexts/Store";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </AuthProvider>
  );
}
