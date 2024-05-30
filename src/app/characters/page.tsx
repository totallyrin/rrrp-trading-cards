"use client";

import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { Card as CardType } from "@/utils/types";
import {
  deleteCard,
  fetchAllCards,
  fetchUserCards,
  updateCard,
} from "@/app/lib/data";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SlideFade,
  Spinner,
  Tab,
  TabList,
  Tabs,
  Tag,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import CharacterCard from "@/components/CharacterCard";
import CustomSlider from "@/components/CustomSlider";
import { ChevronRightIcon, Search2Icon } from "@chakra-ui/icons";
import { DiscordIcon } from "@/components/icons/DiscordIcon";

export default function Characters() {
  const { data: session } = useSession();
  const [allCards, setAllCards] = useState<CardType[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [modalCard, setModalCard] = useState<CardType | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    if (session?.user.role === "admin")
      fetchAllCards()
        .then((cards) => {
          setAllCards(cards as CardType[]);
          setCards(
            cards.filter(
              (card) => card.owner === session.user.name,
            ) as CardType[],
          );
        })
        .catch((error) => {
          console.error(error);
        });
    else if (session?.user.name)
      fetchUserCards(session.user.name)
        .then((cards) => {
          setCards(cards as CardType[]);
        })
        .catch((error) => {
          console.error(error);
        });
  }, [session?.user.role, session?.user.name]);

  if (session === null)
    return (
      <VStack height="100%" spacing={5}>
        <Tag
          textAlign="center"
          // colorScheme="red"
        >
          You must be signed in to manage your characters.
        </Tag>
        <Button
          variant="discord"
          onClick={() => signIn("discord")}
          leftIcon={<DiscordIcon />}
          rightIcon={<ChevronRightIcon />}
        >
          Sign in with Discord
        </Button>
      </VStack>
    );

  if (!session || cards.length === 0)
    return (
      <Center height="100%">
        <Spinner size="xl" thickness="3px" />
      </Center>
    );

  return (
    <Flex
      width="100%"
      height="100%"
      overflowX="hidden"
      overflowY="hidden"
      flexDirection="column"
    >
      <Box>
        <InputGroup mb={1}>
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search by name"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </InputGroup>
        {session.user.role === "admin" && (
          <Tabs>
            <TabList mb={4}>
              <Tab
                onClick={() =>
                  setCards(
                    cards.filter((card) => card.owner === session.user.name),
                  )
                }
              >
                My characters
              </Tab>
              <Tab onClick={() => setCards(allCards)}>All characters</Tab>
            </TabList>
          </Tabs>
        )}
      </Box>

      <Box flexGrow={1} overflowY="scroll" overflowX="hidden">
        <SlideFade in={session && cards.length > 0}>
          <VStack width="100%" height="100%" overflowY="scroll">
            {cards
              .filter((card) =>
                card.name.toLowerCase().includes(searchText.toLowerCase()),
              )
              .map((card, i) => (
                <>
                  {i > 0 && <Divider my={2} />}
                  <HStack
                    width="100%"
                    alignItems="center"
                    justifyContent="space-around"
                    flexWrap="wrap"
                    key={i}
                  >
                    <Box width="30%" minWidth={350}>
                      <VStack flexGrow={1}>
                        <CharacterCard
                          character={card}
                          sx={{
                            width: "100%",
                          }}
                        />
                      </VStack>
                    </Box>
                    <Flex flexDirection="column" pl={2} flexGrow={5}>
                      <FormControl>
                        <Box pb={1}>
                          <Heading size="xs" p={2} pt={0}>
                            Character Name
                          </Heading>
                          <Input
                            placeholder="Name"
                            value={card.name ?? ""}
                            onChange={(e) => {
                              const updatedCards = cards.map((c) => {
                                if (c.id === card.id) {
                                  return { ...c, name: e.target.value };
                                }
                                return c;
                              });
                              setCards(updatedCards);
                            }}
                            isRequired
                          />
                        </Box>
                        <Box py={1}>
                          <Heading size="xs" p={2}>
                            Pronouns
                          </Heading>
                          <Input
                            placeholder="they/them"
                            value={card.pronouns ?? ""}
                            onChange={(e) => {
                              const updatedCards = cards.map((c) => {
                                if (c.id === card.id) {
                                  return { ...c, pronouns: e.target.value };
                                }
                                return c;
                              });
                              setCards(updatedCards);
                            }}
                          />
                        </Box>
                        <Box py={1}>
                          <Heading size="xs" p={2}>
                            Image Link
                          </Heading>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={card.image ?? ""}
                            onChange={(e) => {
                              const updatedCards = cards.map((c) => {
                                if (c.id === card.id) {
                                  return { ...c, image: e.target.value };
                                }
                                return c;
                              });
                              setCards(updatedCards);
                            }}
                            isDisabled={session.user.role !== "admin"}
                          />
                        </Box>
                        <Box py={1}>
                          <Heading size="xs" p={2}>
                            Occupation
                          </Heading>
                          <Input
                            placeholder="Unemployed"
                            value={card.occupation ?? ""}
                            onChange={(e) => {
                              const updatedCards = cards.map((c) => {
                                if (c.id === card.id) {
                                  return {
                                    ...c,
                                    occupation:
                                      e.target.value.length > 0
                                        ? e.target.value
                                        : undefined,
                                  };
                                }
                                return c;
                              });
                              setCards(updatedCards);
                            }}
                          />
                        </Box>
                        <Box py={1}>
                          <Heading size="xs" p={2}>
                            Residence
                          </Heading>
                          <Input
                            placeholder="Valentine"
                            value={card.residence ?? ""}
                            onChange={(e) => {
                              const updatedCards = cards.map((c) => {
                                if (c.id === card.id) {
                                  return {
                                    ...c,
                                    residence:
                                      e.target.value.length > 0
                                        ? e.target.value
                                        : undefined,
                                  };
                                }
                                return c;
                              });
                              setCards(updatedCards);
                            }}
                          />
                        </Box>
                        <Box py={1}>
                          <Heading size="xs" p={2}>
                            Special Interests
                          </Heading>
                          <Input
                            placeholder="Hobbies/interests"
                            value={card.special_interest ?? ""}
                            onChange={(e) => {
                              const updatedCards = cards.map((c) => {
                                if (c.id === card.id) {
                                  return {
                                    ...c,
                                    special_interest:
                                      e.target.value.length > 0
                                        ? e.target.value
                                        : undefined,
                                  };
                                }
                                return c;
                              });
                              setCards(updatedCards);
                            }}
                          />
                        </Box>
                        <Box py={1}>
                          <Heading size="xs" p={2}>
                            Character Quote
                          </Heading>
                          <Textarea
                            placeholder="Be gay, do crime!"
                            value={card.quote ?? ""}
                            onChange={(e) => {
                              const updatedCards = cards.map((c) => {
                                if (c.id === card.id) {
                                  return {
                                    ...c,
                                    quote:
                                      e.target.value.length > 0
                                        ? e.target.value
                                        : undefined,
                                  };
                                }
                                return c;
                              });
                              setCards(updatedCards);
                            }}
                          />
                        </Box>
                        {session.user.role === "admin" && (
                          <Box py={1}>
                            <Heading size="xs" p={2}>
                              Owner
                            </Heading>
                            <Input
                              placeholder="username"
                              value={card.owner ?? ""}
                              onChange={(e) => {
                                const updatedCards = cards.map((c) => {
                                  if (c.id === card.id) {
                                    return {
                                      ...c,
                                      owner:
                                        e.target.value.length > 0
                                          ? e.target.value
                                          : undefined,
                                    };
                                  }
                                  return c;
                                });
                                setCards(updatedCards);
                              }}
                            />
                          </Box>
                        )}
                      </FormControl>
                    </Flex>
                    <VStack height="100%" flexGrow={1} minWidth={355}>
                      <Flex
                        flexDirection="column"
                        height="100%"
                        width="100%"
                        pr={3}
                      >
                        <FormControl>
                          <CustomSlider
                            card={card}
                            cards={cards}
                            setCards={setCards}
                            title="Strength"
                            attribute="strength"
                            color="#FF595E"
                          />
                          <CustomSlider
                            card={card}
                            cards={cards}
                            setCards={setCards}
                            title="Comedic Timing"
                            attribute="comedic_timing"
                            color="#FF924C"
                          />
                          <CustomSlider
                            card={card}
                            cards={cards}
                            setCards={setCards}
                            title="Dirty Minded"
                            attribute="dirty_minded"
                            color="#FFCA3A"
                          />
                          <CustomSlider
                            card={card}
                            cards={cards}
                            setCards={setCards}
                            title="Accident Prone"
                            attribute="accident_prone"
                            color="#8AC926"
                          />
                          <CustomSlider
                            card={card}
                            cards={cards}
                            setCards={setCards}
                            title="Rizz"
                            attribute="rizz"
                            color="#1982C4"
                          />
                          <CustomSlider
                            card={card}
                            cards={cards}
                            setCards={setCards}
                            title="Serving"
                            attribute="serving_cunt"
                            color="#6A4C93"
                          />
                        </FormControl>
                      </Flex>
                      <HStack pt={5}>
                        <Button
                          colorScheme="green"
                          onClick={() => {
                            if (card.name.length > 0)
                              updateCard(card)
                                .then(() => {
                                  toast({
                                    title: `${card.name} saved.`,
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true,
                                  });
                                })
                                .catch((e) => {
                                  console.error(e);
                                  toast({
                                    title: `${card.name} failed to save.\n${e}`,
                                    status: "error",
                                    duration: 3000,
                                    isClosable: true,
                                  });
                                });
                            else
                              toast({
                                title: "Name cannot be empty.",
                                status: "error",
                                duration: 3000,
                                isClosable: true,
                              });
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            setModalCard(card);
                            onOpen();
                          }}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </VStack>
                  </HStack>
                </>
              ))}
          </VStack>
          <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            // @ts-ignore
            leastDestructiveRef={cancelRef}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Character Card
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete
                  <Badge colorScheme="red" ml={1} mr={0.5} mb={0.5}>
                    {modalCard?.name}
                  </Badge>
                  ? You can&apos;t undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    onClick={onClose}
                    // @ts-ignore
                    ref={cancelRef}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      if (modalCard)
                        deleteCard(modalCard)
                          .then(() => {
                            const updatedCards = cards.filter(
                              (c) => c.id !== modalCard?.id,
                            );
                            setCards(updatedCards);
                            toast({
                              title: `${modalCard?.name} deleted.`,
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                          })
                          .catch((e) => {
                            console.error(e);
                            toast({
                              title: `${modalCard?.name} failed to delete.\n${e}`,
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          });
                      else console.log("no card to delete");
                      onClose();
                    }}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </SlideFade>
      </Box>
    </Flex>
  );
}
