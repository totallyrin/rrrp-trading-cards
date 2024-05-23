import { Box, Flex } from "@chakra-ui/react";

export default function DividerRainbow({ size = 2 }) {
  const alpha = 0.75;

  return (
    <Flex height={size} width="100%">
      <Box
        flexGrow={1}
        // bg="#FF595E"
        bg={`rgba(255, 89, 94, ${alpha})`}
      />
      <Box
        flexGrow={1}
        // bg="#FF924C"
        bg={`rgba(255, 146, 76, ${alpha})`}
      />
      <Box
        flexGrow={1}
        // bg="#FFCA3A"
        bg={`rgba(255, 202, 58, ${alpha})`}
      />
      <Box
        flexGrow={1}
        // bg="#8AC926"
        bg={`rgba(138, 201, 38, ${alpha})`}
      />
      <Box
        flexGrow={1}
        // bg="#1982C4"
        bg={`rgba(25, 130, 196, ${alpha})`}
      />
      <Box
        flexGrow={1}
        // bg="#6A4C93"
        bg={`rgba(106, 76, 147, ${alpha})`}
      />
    </Flex>
  );
}
