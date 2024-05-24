"use client";

import CharacterCard from "@/components/CharacterCard";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import CustomSlider from "@/components/CustomSlider";
import { addCard, fetchUserCards } from "@/app/lib/data";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Card as CardType } from "@/utils/types";
import { PlusSquareIcon } from "@chakra-ui/icons";

export default function Create() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<CardType[]>([]);
  const [card, setCard] = useState<CardType>({
    name: "",
    pronouns: "",
    strength: 1,
    comedic_timing: 1,
    dirty_minded: 1,
    accident_prone: 1,
    rizz: 1,
    serving_cunt: 1,
    image: undefined,
    id: 0,
    residence: undefined,
    occupation: undefined,
    quote: undefined,
    special_interest: undefined,
    owner: session?.user.name ?? "",
  });
  const toast = useToast();

  useEffect(() => {
    if (session?.user.role !== "admin" && session?.user.name)
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
      <VStack height="100%" pt={10}>
        <Text textAlign="center" mb={3}>
          You must be signed in to manage your characters.
        </Text>
        <Button onClick={() => signIn()}>Click here to sign in!</Button>
      </VStack>
    );

  if (!session)
    return (
      <Center height="100%">
        <Spinner size="xl" thickness="3px" />
      </Center>
    );

  if (cards.length >= 3)
    return (
      <Center height="100%">
        <Text>You have reached the maximum number of characters (3).</Text>
      </Center>
    );

  return (
    <VStack
      height="100%"
      justifyContent="center"
      px={[0, 0, 0, 125, 250, 500, 1000]}
    >
      <HStack width="100%" height="100%" flexWrap="wrap">
        <VStack flexGrow={1}>
          <CharacterCard
            character={card}
            sx={{
              width: "100%",
              // transform: "scale(0.96)",
              transition: "all 0.2s ease-in-out",
              _hover: {
                // transform: "scale(1)",
              },
            }}
          />
        </VStack>
        <Flex flexDirection="column" pl={2} flexGrow={5}>
          <FormControl>
            <Box pb={1}>
              <Heading size="xs" p={2} pt={0}>
                Character Name
              </Heading>
              <Input
                placeholder="Name"
                value={card.name ?? ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    name: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setCard({
                    ...card,
                    pronouns: e.target.value,
                  })
                }
              />
            </Box>
            <Box py={1}>
              <Heading size="xs" p={2}>
                Image Link
              </Heading>
              <Input
                placeholder="https://example.com/image.jpg"
                value={card.image ?? ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    image: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setCard({
                    ...card,
                    occupation: e.target.value,
                  })
                }
              />
            </Box>
            <Box py={1}>
              <Heading size="xs" p={2}>
                Residence
              </Heading>
              <Input
                placeholder="Valentine"
                value={card.residence ?? ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    residence: e.target.value,
                  })
                }
              />
            </Box>
            <Box py={1}>
              <Heading size="xs" p={2}>
                Special Interests
              </Heading>
              <Input
                placeholder="Hobbies/interests"
                value={card.special_interest ?? ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    special_interest: e.target.value,
                  })
                }
              />
            </Box>
            <Box py={1}>
              <Heading size="xs" p={2}>
                Character Quote
              </Heading>
              <Textarea
                placeholder="Be gay, do crime!"
                value={card.quote ?? ""}
                onChange={(e) =>
                  setCard({
                    ...card,
                    quote: e.target.value,
                  })
                }
              />
            </Box>
          </FormControl>
        </Flex>
      </HStack>
      <VStack justifyContent="center" width="100%">
        <Flex flexDirection="column" width="100%" mb={5}>
          <FormControl>
            <CustomSlider
              card={card}
              setCards={setCard}
              title="Strength"
              attribute="strength"
              color="#FF595E"
            />
            <CustomSlider
              card={card}
              setCards={setCard}
              title="Comedic Timing"
              attribute="comedic_timing"
              color="#FF924C"
            />
            <CustomSlider
              card={card}
              setCards={setCard}
              title="Dirty Minded"
              attribute="dirty_minded"
              color="#FFCA3A"
            />
            <CustomSlider
              card={card}
              setCards={setCard}
              title="Accident Prone"
              attribute="accident_prone"
              color="#8AC926"
            />
            <CustomSlider
              card={card}
              setCards={setCard}
              title="Rizz"
              attribute="rizz"
              color="#1982C4"
            />
            <CustomSlider
              card={card}
              setCards={setCard}
              title="Serving"
              attribute="serving_cunt"
              color="#6A4C93"
            />
          </FormControl>
        </Flex>
        <Button
          colorScheme="green"
          rightIcon={<PlusSquareIcon />}
          onClick={() => {
            if (card.name.length > 0)
              addCard({ ...card, owner: session.user.name ?? "" })
                .then(() => {
                  toast({
                    title: `${card.name} created.`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                })
                .catch((e) => {
                  console.error(e);
                  toast({
                    title: `${card.name} could not be created.\n${e}`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                });
            else {
              toast({
                title: "Name cannot be empty.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          }}
        >
          Create Character
        </Button>
      </VStack>
    </VStack>
  );
}
