"use client";

import CharacterCard from "@/components/CharacterCard";
import {
  Badge,
  Box,
  Button,
  Center,
  Code,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  HStack,
  Input,
  Spinner,
  Tag,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import CustomSlider from "@/components/CustomSlider";
import { addCard, addImage, fetchUserCards } from "@/app/lib/data";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Card as CardType } from "@/utils/types";
import { ChevronRightIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { DiscordIcon } from "@/components/icons/DiscordIcon";

export default function Create() {
  const { data: session } = useSession();
  const defaultCard = {
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
  };
  const [cards, setCards] = useState<CardType[]>([]);
  const [card, setCard] = useState<CardType>(defaultCard);
  const [isError, setIsError] = useState(false);
  const [image, setImage] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (session?.user.admin && session?.user.name)
      fetchUserCards(session.user.name)
        .then((cards) => {
          setCards(cards as CardType[]);
        })
        .catch((error) => {
          console.error(error);
        });
  }, [session?.user.admin, session?.user.name]);

  if (session === null)
    return (
      <VStack height="100%" spacing={5}>
        <Tag
          textAlign="center"
          // colorScheme="red"
        >
          You must be signed in to create a character.
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

  if (!session)
    return (
      <Center height="100%">
        <Spinner size="xl" thickness="3px" />
      </Center>
    );

  if (!session.user.allowlisted)
    return (
      <Center height="100%">
        <Tag>
          You do not have permission to create characters. You need to have the{" "}
          <Badge>Allowlisted</Badge> role.
        </Tag>
      </Center>
    );

  if (!session.user.admin && cards.length >= 3)
    return (
      <Center height="100%">
        <Tag>You have reached the maximum number of characters (3).</Tag>
      </Center>
    );

  return (
    <VStack overflowY="auto" height="100%">
      <HStack width="100%" flexWrap="wrap">
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
            <FormControl py={1} isInvalid={isError}>
              <Heading size="xs" p={2}>
                Image Link
              </Heading>
              <Input
                placeholder="https://example.com/image.jpg"
                defaultValue={card.image ?? ""}
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  if (
                    /https:\/\/(cdn\.discordapp\.com|media\.discordapp\.net)\/attachments\/.*$/.test(
                      e.target.value,
                    ) ||
                    e.target.value === ""
                  ) {
                    setIsError(false);
                    setCard({
                      ...card,
                      image: e.target.value,
                    });
                  } else setIsError(true);
                }}
                // isDisabled={!session.user.admin}
              />
              {!isError ? (
                !session.user.admin || (
                  <FormHelperText pl={2} mt={1} overflowWrap="break-word">
                    {"Images need to be verified before they" +
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
            {session.user.admin && (
              <Box py={1}>
                <Heading size="xs" p={2}>
                  Owner
                </Heading>
                <Input
                  placeholder="username"
                  value={card.owner ?? ""}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      owner: e.target.value,
                    })
                  }
                />
              </Box>
            )}
          </FormControl>
        </Flex>
      </HStack>
      <VStack width="100%">
        <Flex flexDirection="column" width="100%" mb={5} px={1}>
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
            if (card.name.length > 0) {
              if (!session.user.admin) {
                addImage(card)
                  .then(() =>
                    setCard({
                      ...card,
                      image: "",
                    }),
                  )
                  .catch((e) => {
                    console.error(e);
                    toast({
                      title: `${card.name} could not be created.\n${e}`,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                    return;
                  });
              }
              addCard({
                ...card,
                image: session.user.admin ? card.image : "",
                owner: card.owner ?? session.user.name ?? "",
              })
                .then(() => {
                  setCard(defaultCard);
                  setImage("");
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
            } else {
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
