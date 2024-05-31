import type { Metadata } from "next";
import React from "react";
import { Providers } from "@/app/providers";
import { ColorModeScript } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "RRRP Trading Cards",
  description: "RRRP Trading Cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode="system" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
