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
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  CloseIcon,
  DragHandleIcon,
  EditIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import NextLink from "next/link";
import Footer from "@/components/Footer";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mobile] = useMediaQuery("(orientation: portrait)");

  return (
    <>
      <HStack width="100%" justifyContent="space-between" align="center">
        <Box flex="1 1 0">
          {mobile ? (
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
            />
          ) : (
            <Button leftIcon={<HamburgerIcon />} onClick={onOpen}>
              Menu
            </Button>
          )}
        </Box>
        <Flex flex="1 1 0" justifyContent="center">
          <Heading as={NextLink} href="/" size="lg" textAlign="center">
            RRRP Top Trumps
          </Heading>
        </Flex>
        <Flex flex="1 1 0" justifyContent="flex-end">
          {session ? (
            <Menu>
              <MenuButton
                as={IconButton}
                isRound
                aria-label="Profile"
                icon={
                  <Avatar
                    size="sm"
                    name={session?.user?.name ?? ""}
                    src={session?.user?.image ?? ""}
                  />
                }
              />
              <MenuList px={2}>
                <Heading size="md" textAlign="center">
                  {session?.user?.name}
                </Heading>
                <MenuDivider />
                <LinkBox>
                  <LinkOverlay as={NextLink} href="#">
                    <MenuItem
                      as={Button}
                      textAlign="left"
                      rightIcon={<ChevronRightIcon />}
                    >
                      Account
                    </MenuItem>
                  </LinkOverlay>
                </LinkBox>
                <MenuItem
                  as={Button}
                  textAlign="left"
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => signOut()}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
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
          <DrawerBody>
            <VStack width="100%">
              <Button
                as={NextLink}
                href="/"
                width="100%"
                variant="ghost"
                justifyContent="flex-start"
                // rightIcon={<StarIcon />}
              >
                Home
              </Button>
              <Button
                as={NextLink}
                href="/Gallery"
                width="100%"
                variant="ghost"
                justifyContent="space-between"
                rightIcon={<DragHandleIcon />}
              >
                Gallery
              </Button>
              <Button
                as={NextLink}
                href="/ManageCharacters"
                width="100%"
                variant="ghost"
                justifyContent="space-between"
                rightIcon={<EditIcon />}
              >
                Manage Characters
              </Button>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Footer condensed />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
