"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchAllCards, fetchUserCards } from "@/app/lib/data";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  SlideFade,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import CharacterCard from "@/components/CharacterCard";

export default function Characters() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    if (session?.user.role === "admin")
      fetchAllCards()
        .then((cards) => {
          setCards(cards as CardType[]);
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
  }, [session]);

  if (session === null)
    return (
      <VStack height="100%" pt={10}>
        <Text textAlign="center" mb={3}>
          You must be signed in to manage your characters.
        </Text>
        <Button onClick={() => signIn()}>Click here to sign in!</Button>
      </VStack>
    );

  if (!session || cards.length === 0)
    return (
      <Center height="100%">
        <Spinner size="xl" thickness="3px" />
      </Center>
    );

  return (
    <SlideFade in={session && cards.length > 0}>
      <VStack width="100%">
        {cards.map((card, i) => (
          <>
            {i > 0 && <Divider my={2} />}
            <HStack width="100%" alignItems="center" flexWrap="wrap" key={i}>
              <CharacterCard
                key={card.id}
                character={card}
                sx={{
                  width: "30%",
                  // transform: "scale(0.96)",
                  transition: "all 0.2s ease-in-out",
                  _hover: {
                    // transform: "scale(1)",
                  },
                }}
              />
              <Flex flexDirection="column" pl={2} flexGrow={1}>
                <FormControl>
                  <Box py={1}>
                    <Heading size="xs" p={2}>
                      Character Name
                    </Heading>
                    <Input
                      placeholder="Name"
                      defaultValue={card.name}
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
                      defaultValue={card.pronouns}
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
                      defaultValue={card.image}
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
                      defaultValue={card.occupation}
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
                      defaultValue={card.residence}
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
                      defaultValue={card.special_interest}
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
                      defaultValue={card.quote}
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
                </FormControl>
              </Flex>
              <Flex flexDirection="column" px={2} flexGrow={2}>
                <FormControl>
                  <Box py={1}>
                    <Heading size="xs" p={2}>
                      Strength
                    </Heading>
                    <Slider
                      pl={2}
                      pr={5}
                      defaultValue={card.strength}
                      step={1}
                      min={1}
                      max={10}
                      onChange={(e) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, strength: e };
                          }
                          return c;
                        });
                        setCards(updatedCards);
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <SliderMark
                          key={value}
                          value={value}
                          mt="1"
                          alignContent="center"
                        >
                          {value}
                        </SliderMark>
                      ))}
                      <SliderTrack>
                        <SliderFilledTrack bg="#FF595E" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                  <Box py={1}>
                    <Heading size="xs" p={2}>
                      Comedic Timing
                    </Heading>
                    <Slider
                      pl={2}
                      pr={5}
                      defaultValue={card.comedic_timing}
                      step={1}
                      min={1}
                      max={10}
                      onChange={(e) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, comedic_timing: e };
                          }
                          return c;
                        });
                        setCards(updatedCards);
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <SliderMark
                          key={value}
                          value={value}
                          mt="1"
                          alignContent="center"
                        >
                          {value}
                        </SliderMark>
                      ))}
                      <SliderTrack>
                        <SliderFilledTrack bg="#FF924C" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                  <Box py={1}>
                    <Heading size="xs" p={2}>
                      Dirty Minded
                    </Heading>
                    <Slider
                      pl={2}
                      pr={5}
                      defaultValue={card.dirty_minded}
                      step={1}
                      min={1}
                      max={10}
                      onChange={(e) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, dirty_minded: e };
                          }
                          return c;
                        });
                        setCards(updatedCards);
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <SliderMark
                          key={value}
                          value={value}
                          mt="1"
                          alignContent="center"
                        >
                          {value}
                        </SliderMark>
                      ))}
                      <SliderTrack>
                        <SliderFilledTrack bg="#FFCA3A" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                  <Box py={1}>
                    <Heading size="xs" p={2}>
                      Accident Prone
                    </Heading>
                    <Slider
                      pl={2}
                      pr={5}
                      defaultValue={card.accident_prone}
                      step={1}
                      min={1}
                      max={10}
                      onChange={(e) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, accident_prone: e };
                          }
                          return c;
                        });
                        setCards(updatedCards);
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <SliderMark
                          key={value}
                          value={value}
                          mt="1"
                          alignContent="center"
                        >
                          {value}
                        </SliderMark>
                      ))}
                      <SliderTrack>
                        <SliderFilledTrack bg="#8AC926" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                  <Box py={1}>
                    <Heading size="xs" p={2}>
                      Rizz
                    </Heading>
                    <Slider
                      pl={2}
                      pr={5}
                      defaultValue={card.rizz}
                      step={1}
                      min={1}
                      max={10}
                      onChange={(e) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, rizz: e };
                          }
                          return c;
                        });
                        setCards(updatedCards);
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <SliderMark
                          key={value}
                          value={value}
                          mt="1"
                          alignContent="center"
                        >
                          {value}
                        </SliderMark>
                      ))}
                      <SliderTrack>
                        <SliderFilledTrack bg="#1982C4" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                  <Box py={1}>
                    <Heading size="xs" p={2}>
                      Serving
                    </Heading>
                    <Slider
                      pl={2}
                      pr={5}
                      defaultValue={card.serving_cunt}
                      step={1}
                      min={1}
                      max={10}
                      onChange={(e) => {
                        const updatedCards = cards.map((c) => {
                          if (c.id === card.id) {
                            return { ...c, serving_cunt: e };
                          }
                          return c;
                        });
                        setCards(updatedCards);
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <SliderMark
                          key={value}
                          value={value}
                          mt="1"
                          alignContent="center"
                        >
                          {value}
                        </SliderMark>
                      ))}
                      <SliderTrack>
                        <SliderFilledTrack bg="#6A4C93" />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Box>
                </FormControl>
              </Flex>
            </HStack>
          </>
        ))}
      </VStack>
    </SlideFade>
  );
}
