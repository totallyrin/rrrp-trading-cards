// app/providers.tsx
"use client";

import { Box, ChakraProvider, VStack } from "@chakra-ui/react";
import React from "react";
import theme from "@/utils/theme";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider theme={theme}>
        <VStack height="100vh">
          <Navbar />
          {/*<Spacer />*/}
          <Box width="100%" overflowY="auto" height="100%" px={5}>
            {children}
          </Box>
          {/*<Spacer />*/}
          <Footer />
        </VStack>
      </ChakraProvider>
    </SessionProvider>
  );
}
