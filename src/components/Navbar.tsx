import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRightIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import Footer from "@/components/Footer";
import { signIn, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPop, setPop] = useBoolean();

  return (
    <>
      <Popover
        isOpen={isPop}
        onOpen={setPop.on}
        onClose={setPop.off}
        closeOnBlur={true}
        closeOnEsc={true}
        gutter={0}
      >
        <HStack width="100%" justifyContent="space-between" align="center">
          <Box flex="1 1 0">
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
            />
          </Box>
          <Flex flex="1 1 0" justifyContent="center">
            <LinkBox>
              <LinkOverlay as={NextLink} href="/">
                <Heading size="lg">RRRP Top Trumps</Heading>
              </LinkOverlay>
            </LinkBox>
          </Flex>
          <Flex flex="1 1 0" justifyContent="flex-end">
            {session ? (
              <PopoverAnchor>
                <PopoverTrigger>
                  <IconButton
                    isRound
                    aria-label="Profile"
                    icon={<Avatar size="xs" name="" src="" />}
                  />
                </PopoverTrigger>
              </PopoverAnchor>
            ) : (
              <Button rightIcon={<ChevronRightIcon />} onClick={() => signIn()}>
                Sign in
              </Button>
            )}
          </Flex>
        </HStack>
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <Flex justifyContent="space-between">
                RRRP Top Trumps
                <IconButton
                  aria-label="Close"
                  onClick={onClose}
                  size="sm"
                  icon={<CloseIcon />}
                />
              </Flex>
            </DrawerHeader>
            <DrawerBody>text</DrawerBody>
            <DrawerFooter>
              <Footer condensed />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <PopoverContent m={5}>
          <PopoverHeader>
            <Flex justifyContent="space-between">
              Welcome, {session?.user?.name}.
              <IconButton
                aria-label="Close"
                onClick={setPop.off}
                size="xs"
                icon={<CloseIcon />}
              />
            </Flex>
          </PopoverHeader>
          <PopoverBody>text</PopoverBody>
          <PopoverFooter></PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  );
}
