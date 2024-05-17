import type {Metadata} from "next";
import React from "react";
import {ColorModeScript} from "@chakra-ui/react";
import theme from "@/utils/theme";
import {Providers} from "@/app/providers";

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
    <body>
    <Providers>
      <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
      {children}
    </Providers>
    </body>
    </html>
  );
}
