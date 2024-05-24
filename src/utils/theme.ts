import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
  fonts: {
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
  },
  components: {
    Button: {
      variants: {
        discord: (props: StyleFunctionProps) => ({
          bg: "#5865F2",
          color: "white",
          _hover: {
            bg: "#7289DA",
          },
        }),
      },
    },
  },
});

export default theme;