import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Text,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import NextLink from "next/link";

export default function Footer({ condensed = false }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mobile] = useMediaQuery("(orientation: portrait)");

  return (
    <HStack width="100%" justifyContent="space-between" mt={3}>
      <Box flex="1 1 0">
        {condensed || mobile ? (
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            aria-label={`${colorMode === "light" ? "Dark" : "Light"} Mode`}
          />
        ) : (
          <Button
            onClick={toggleColorMode}
            leftIcon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          >
            {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
        )}
      </Box>
      <Flex flex="1 1 0" justifyContent="center">
        {condensed ? null : (
          <Text as="samp" fontSize="xs" textAlign="center">
            MADE WITH &#x1F49B; BY TOTALLYRIN
          </Text>
        )}
      </Flex>
      <Flex flex="1 1 0" justifyContent="flex-end">
        <LinkBox>
          <LinkOverlay
            as={NextLink}
            href="https://github.com/totallyrin/rrrp-top-trumps"
            isExternal
          >
            {condensed || mobile ? (
              <IconButton icon={<GitHubIcon />} aria-label="GitHub" />
            ) : (
              <Button rightIcon={<GitHubIcon />}>GitHub</Button>
            )}
          </LinkOverlay>
        </LinkBox>
      </Flex>
    </HStack>
  );
}
