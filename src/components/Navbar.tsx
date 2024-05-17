import {Avatar, Heading, HStack, IconButton, LinkBox, LinkOverlay, Spacer} from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";
import NextLink from "next/link";

export default function Navbar() {

  return (
    <HStack width="100%" p={5}>
      <IconButton aria-label="Menu" icon={<HamburgerIcon/>}/>
      <Spacer/>
      <LinkBox>
        <LinkOverlay as={NextLink} href="/">
          <Heading size="lg">RRRP Top Trumps</Heading>
        </LinkOverlay>
      </LinkBox>
      <Spacer/>
      <Avatar size="sm" name="" src=""/>
    </HStack>
  );
}
