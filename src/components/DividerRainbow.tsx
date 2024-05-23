import { Box, Flex } from "@chakra-ui/react";

export default function DividerRainbow({ size = 2 }) {
  return (
    <Flex height={size} width="100%">
      <Box flexGrow={1} bg="#FF595E" />
      <Box flexGrow={1} bg="#FF924C" />
      <Box flexGrow={1} bg="#FFCA3A" />
      <Box flexGrow={1} bg="#8AC926" />
      <Box flexGrow={1} bg="#1982C4" />
      <Box flexGrow={1} bg="#6A4C93" />
    </Flex>
  );
}
