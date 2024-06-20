"use client";

import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { Card as CardType, VerifyImage } from "@/utils/types";
import {
  deleteCard,
  fetchAllCards,
  fetchAllImages,
  fetchUserCards,
  fetchUserImages,
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
  Code,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
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
  Text,
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
  const [allFetchedCards, setAllFetchedCards] = useState<CardType[]>([]);
  const [fetchedCards, setFetchedCards] = useState<CardType[]>([]);
  const [images, setImages] = useState<VerifyImage[]>([]);
  const [allImages, setAllImages] = useState<VerifyImage[]>([]);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [modalCard, setModalCard] = useState<CardType | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [isError, setIsError] = useState<number[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    if (session?.user.admin) {
      fetchAllImages()
        .then((imgs) => {
          setAllImages(imgs as VerifyImage[]);
          setImages(
            imgs.filter(
              (image) => image.user === session?.user.name,
            ) as VerifyImage[],
          );
          setPendingImages(imgs.map((i) => i.character));
        })
        .catch((error) => {
          console.error(error);
        });
      fetchAllCards()
        .then((cards) => {
          // setAllCards(cards as CardType[]);
          setAllFetchedCards(cards as CardType[]);
          // setCards(
          //   cards.filter(
          //     (card) => card.owner === session.user.name,
          //   ) as CardType[],
          // );
          setFetchedCards(
            cards.filter(
              (card) => card.owner === session.user.name,
            ) as CardType[],
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (session?.user.name) {
      fetchUserImages(session.user.name)
        .then((imgs) => {
          setImages(imgs as VerifyImage[]);
          setPendingImages(imgs.map((i) => i.character));
        })
        .catch((error) => {
          console.error(error);
        });
      fetchUserCards(session.user.name)
        .then((cards) => {
          // setCards(cards as CardType[]);
          setFetchedCards(cards as CardType[]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [session?.user.admin, session?.user.name]);

  useEffect(() => {
    if (session?.user.admin) {
      if (allImages.length === 0) {
        setAllCards(allFetchedCards);
        setCards(
          allFetchedCards.filter((card) => card.owner === session.user.name),
        );
      } else
        allImages.forEach((image) => {
          const card = allFetchedCards.find((c) => c.name === image.character);
          if (card) {
            const updatedCards = allFetchedCards.map((c) => {
              if (c.name === card.name) {
                return {
                  ...c,
                  newimage: image.image,
                };
              }
              return c;
            });
            setAllCards(updatedCards);
            setCards(
              updatedCards.filter((card) => card.owner === session.user.name),
            );
          }
        });
    } else {
      if (images.length === 0) {
        setCards(fetchedCards);
      } else
        images.map((image) => {
          const card = fetchedCards.find(
            (card) => card.name === image.character,
          );
          if (card) {
            const updatedCards = fetchedCards.map((c) => {
              if (c.name === card.name) {
                return {
                  ...c,
                  newimage: image.image,
                };
              }
              return c;
            });
            setCards(updatedCards);
          }
        });
    }
  }, [
    session?.user.admin,
    session?.user.name,
    allImages,
    images,
    allFetchedCards,
    fetchedCards,
  ]);

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
            // isDisabled
          />
        </InputGroup>
        {session.user.admin && (
          <Tabs>
            <TabList mb={1}>
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

      <Box flexGrow={1} overflowY="scroll" overflowX="hidden" mt={3}>
        <SlideFade in={session && cards.length > 0}>
          <VStack width="100%" height="100%" overflowY="scroll">
            {cards
              .filter((card) =>
                card.name.toLowerCase().includes(searchText.toLowerCase()),
              )
              .map((card, i) => (
                <Box key={card.id} width="100%">
                  {i > 0 && <Divider my={2} />}
                  <HStack
                    width="100%"
                    alignItems="center"
                    justifyContent="space-around"
                    flexWrap="wrap"
                  >
                    <CharacterCard
                      character={{
                        ...card,
                        image: card.newimage ?? card.image ?? "",
                      }}
                      sx={{
                        flexGrow: 1,
                      }}
                    />
                    <Flex flexDirection="column" pl={2} flexGrow={3}>
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
                                return {
                                  ...c,
                                  pronouns: e.target.value.toLowerCase(),
                                };
                              }
                              return c;
                            });
                            setCards(updatedCards);
                          }}
                        />
                      </Box>
                      <FormControl py={1} isInvalid={isError.includes(card.id)}>
                        <Heading as={FormLabel} size="xs" p={2} pb={0}>
                          Image Link
                        </Heading>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          defaultValue={card.newimage ?? card.image ?? ""}
                          onChange={(e) => {
                            const updatedCards = cards.map((c) => {
                              if (
                                /https:\/\/(cdn\.discordapp\.com|media\.discordapp\.net)\/attachments\/.*$/.test(
                                  e.target.value,
                                ) ||
                                e.target.value === ""
                              ) {
                                setIsError(
                                  isError.filter((i) => i !== card.id),
                                );
                                if (c.id === card.id) {
                                  // if (session.user.admin)
                                  //   return {
                                  //     ...c,
                                  //     image: e.target.value,
                                  //   };
                                  // else
                                  return { ...c, newimage: e.target.value };
                                }
                              } else setIsError([...isError, card.id]);
                              return c;
                            });
                            setCards(updatedCards);
                          }}
                          isDisabled={!session.user.admin}
                        />
                        {!isError.includes(card.id) ? (
                          !session.user.admin || (
                            <FormHelperText
                              pl={2}
                              mt={1}
                              overflowWrap="break-word"
                            >
                              {pendingImages.includes(card.name)
                                ? "This image is waiting to be verified."
                                : "Images need to be verified before they" +
                                  " appear publicly."}
                            </FormHelperText>
                          )
                        ) : (
                          <FormErrorMessage pl={2} mt={1}>
                            <Text overflowWrap="break-word">
                              Image link must match
                              <Code mx={2} colorScheme="red">
                                https://cdn.discordapp.com/attachments/...
                              </Code>
                              <br />
                              or
                              <Code mx={2} colorScheme="red">
                                https://media.discordapp.net/attachments/...
                              </Code>
                            </Text>
                          </FormErrorMessage>
                        )}
                      </FormControl>
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
                      {session.user.admin && (
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
                    </Flex>
                    <VStack height="100%" flexGrow={2} minWidth={300}>
                      <Flex
                        flexDirection="column"
                        height="100%"
                        width="100%"
                        pr={3}
                      >
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
                </Box>
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
