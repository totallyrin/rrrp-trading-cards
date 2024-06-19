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
  SkeletonCircle,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  DragHandleIcon,
  EditIcon,
  HamburgerIcon,
  LockIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import NextLink from "next/link";
import Footer from "@/components/Footer";
import { signIn, signOut, useSession } from "next-auth/react";
import DividerRainbow from "@/components/DividerRainbow";
import { DiscordIcon } from "@/components/icons/DiscordIcon";

export default function Navbar() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mobile] = useMediaQuery("(orientation: portrait)", {
    ssr: true,
    fallback: true,
  });

  return (
    <>
      <Flex direction="column" width="100%" mb={3}>
        <HStack
          width="100%"
          justifyContent="space-between"
          align="center"
          p={5}
        >
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
              RRRP Trading Cards
            </Heading>
          </Flex>
          <Flex flex="1 1 0" justifyContent="flex-end">
            {session !== null ? (
              <Menu>
                <MenuButton
                  as={IconButton}
                  isRound
                  aria-label="Profile"
                  icon={
                    session ? (
                      <>
                        <Avatar
                          size="sm"
                          name={session?.user?.name ?? ""}
                          src={session?.user?.image ?? ""}
                        />
                        <MenuList px={2}>
                          <Heading size="md" textAlign="center">
                            {session?.user?.name}
                          </Heading>
                          <MenuDivider />
                          <LinkBox>
                            <LinkOverlay as={NextLink} href="/account">
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
                      </>
                    ) : (
                      <SkeletonCircle size="8" />
                    )
                  }
                />
              </Menu>
            ) : mobile ? (
              <IconButton
                aria-label={"Sign in with Discord"}
                variant="discord"
                onClick={() => signIn("discord")}
                icon={<DiscordIcon />}
              />
            ) : (
              <Button
                variant="discord"
                onClick={() => signIn("discord")}
                leftIcon={<DiscordIcon />}
                rightIcon={<ChevronRightIcon />}
                py={3}
              >
                Sign in
              </Button>
            )}
          </Flex>
        </HStack>
        <DividerRainbow />
      </Flex>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Flex justifyContent="space-between">
              RRRP Trading Cards
              <IconButton
                aria-label="Close"
                onClick={onClose}
                size="sm"
                icon={<CloseIcon />}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Flex
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
            >
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
                  href="/gallery"
                  width="100%"
                  variant="ghost"
                  justifyContent="space-between"
                  rightIcon={<DragHandleIcon />}
                >
                  Gallery
                </Button>
                <Button
                  as={NextLink}
                  href="/compare"
                  width="100%"
                  variant="ghost"
                  justifyContent="space-between"
                  rightIcon={<CopyIcon />}
                >
                  Compare
                </Button>
                <Button
                  as={NextLink}
                  href="/create"
                  width="100%"
                  variant="ghost"
                  justifyContent="space-between"
                  rightIcon={<PlusSquareIcon />}
                >
                  Create Character
                </Button>
                <Button
                  as={NextLink}
                  href="/manage"
                  width="100%"
                  variant="ghost"
                  justifyContent="space-between"
                  rightIcon={<EditIcon />}
                >
                  Manage Characters
                </Button>
              </VStack>
              {session?.user?.admin && (
                <VStack>
                  <Button
                    as={NextLink}
                    href="/verify"
                    width="100%"
                    variant="ghost"
                    justifyContent="space-between"
                    rightIcon={<CheckCircleIcon />}
                  >
                    Verify Images
                  </Button>
                  <Button
                    as={NextLink}
                    href="/admin"
                    width="100%"
                    variant="ghost"
                    justifyContent="space-between"
                    rightIcon={<LockIcon />}
                  >
                    Admin
                  </Button>
                </VStack>
              )}
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Footer condensed />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
