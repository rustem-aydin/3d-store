"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "../app/components/scroll-to-top";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
