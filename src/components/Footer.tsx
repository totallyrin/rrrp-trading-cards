import {Button, HStack, LinkBox, LinkOverlay, Spacer, Text, useColorMode} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {GitHubIcon} from "@/components/icons/GitHubIcon";
import NextLink from "next/link";

export default function Footer() {
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <HStack p={5} width="100%">
      <Button onClick={toggleColorMode} leftIcon={colorMode === "dark" ? <SunIcon/> :
        <MoonIcon/>}>{colorMode === "light" ? "Dark" : "Light"} Mode</Button>
      <Spacer/>
      <Text as="samp" fontSize="xs">MADE WITH &#x1F49B; BY TOTALLYRIN</Text>
      <Spacer/>
      <LinkBox>
        <LinkOverlay as={NextLink} href="https://github.com/totallyrin/rrrp-top-trumps" isExternal>
          <Button rightIcon={<GitHubIcon/>}>GitHub</Button>
        </LinkOverlay>
      </LinkBox>
    </HStack>
  );
}