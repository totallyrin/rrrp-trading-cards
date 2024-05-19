// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "@/utils/theme";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SessionProvider>
  );
}