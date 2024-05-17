import type {Metadata} from "next";
import {Inter} from "next/font/google";
import React from "react";
import {ColorModeScript} from "@chakra-ui/react";
import theme from "@/utils/theme";
import {Providers} from "@/app/providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Top Trumps",
  description: "Top Trumps",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <Providers>
      <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
      {children}
    </Providers>
    </body>
    </html>
  );
}
