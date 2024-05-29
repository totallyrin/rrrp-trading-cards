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
          <Box
            sx={{
              px: 5,
              width: "100%",
              height: "100%",
              overflowY: "hidden",
            }}
          >
            {children}
          </Box>
          {/*<Spacer />*/}
          <Footer />
        </VStack>
      </ChakraProvider>
    </SessionProvider>
  );
}
