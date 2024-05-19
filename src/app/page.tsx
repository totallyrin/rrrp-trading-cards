"use client";

import { Spacer, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <VStack height="100vh" p={5}>
      <Navbar />
      text
      <Spacer />
      <Footer />
    </VStack>
  );
}
