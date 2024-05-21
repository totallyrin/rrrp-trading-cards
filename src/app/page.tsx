"use client";

import { Box, Spacer, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardGallery from "@/components/CardGallery";

export default function Home() {
  return (
    <VStack height="100vh" p={5}>
      <Navbar />
      <Spacer />

      <Box width="100%" overflowY="auto">
        <CardGallery />
      </Box>

      <Spacer />
      <Footer />
    </VStack>
  );
}
