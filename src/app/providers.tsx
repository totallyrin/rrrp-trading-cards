// app/providers.tsx
"use client";

import { Box, ChakraProvider, Spacer, VStack } from "@chakra-ui/react";
import React from "react";
import theme from "@/utils/theme";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider theme={theme}>
        <VStack height="100vh" p={5}>
          <Navbar />
          <Spacer />

          <Box width="100%" overflowY="auto">
            {children}
          </Box>

          <Spacer />
          <Footer />
        </VStack>
      </ChakraProvider>
    </SessionProvider>
  );
}
