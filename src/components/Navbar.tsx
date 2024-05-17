import {Avatar, Heading, HStack, IconButton, Spacer} from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";

export default function Navbar() {

  return (
    <HStack width="100%" p={5}>
      <IconButton aria-label="Menu" icon={<HamburgerIcon/>}/>
      <Spacer/>
      <Heading size="md">RRRP Top Trumps</Heading>
      <Spacer/>
      <Avatar name="" src=""/>
    </HStack>
  );
}
