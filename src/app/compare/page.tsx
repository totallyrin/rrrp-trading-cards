"use client";

import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  SlideFade,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchAllCards } from "@/app/lib/data";
import {
  ArrowBackIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import CharacterCard from "@/components/CharacterCard";

export default function Compare() {
  const [mobile] = useMediaQuery("(orientation: portrait)", {
    ssr: true,
    fallback: true,
  });
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAllCards()
      .then((cards) => {
        setCards(cards as CardType[]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (cards.length === 0)
    return (
      <AbsoluteCenter>
        <Spinner size="xl" thickness="3px" />
      </AbsoluteCenter>
    );

  if (mobile)
    return (
      <VStack width="100%" height="100%">
        <Menu
          closeOnSelect={false}
          preventOverflow
          // matchWidth
          // gutter={20}
        >
          <HStack width="100%">
            <MenuButton
              as={Button}
              leftIcon={<ChevronDownIcon />}
              flexGrow={1}
              textAlign="left"
              textOverflow="ellipsis"
            >
              {selectedCards.length} character
              {selectedCards.length !== 1 && "s"} selected
            </MenuButton>
            <Button onClick={() => setSelectedCards([])} colorScheme="red">
              Clear
            </Button>
          </HStack>
          <MenuList overflowY="scroll" maxH={350}>
            <MenuOptionGroup
              type="checkbox"
              onChange={(e) =>
                setSelectedCards(cards.filter((c) => e.includes(c.name)))
              }
              value={selectedCards.map((c) => c.name)}
            >
              {cards.map((card) => (
                <MenuItemOption
                  key={card.name}
                  type="checkbox"
                  value={card.name}
                >
                  {card.name}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <Box overflowY="auto" mt={3} flexGrow={1} width="100%">
          {selectedCards.length === 0 && (
            <Center width="100%">
              <SlideFade in={selectedCards.length === 0}>
                <Tag mt={2}>
                  <TagLeftIcon as={ArrowUpIcon} />
                  <TagLabel>Select some characters to compare!</TagLabel>
                </Tag>
              </SlideFade>
            </Center>
          )}
          <SlideFade in={selectedCards.length > 0}>
            <SimpleGrid minChildWidth={300} spacing={2}>
              {selectedCards.map((card, i) => (
                <CharacterCard
                  character={card}
                  key={i}
                  sx={{
                    transform: "scale(0.96)",
                    transition: "all 0.2s ease-in-out",
                    _hover: {
                      transform: "scale(1)",
                    },
                  }}
                />
              ))}
            </SimpleGrid>
          </SlideFade>
        </Box>
      </VStack>
    );

  return (
    <Flex height="100%">
      <VStack maxWidth="30%">
        <InputGroup>
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
        <Box overflowY="auto" width="100%">
          <VStack width="100%">
            {cards
              .filter((c) => c.name.toLowerCase().includes(searchText))
              .map((card) => (
                <Button
                  key={card.name}
                  width="100%"
                  variant="ghost"
                  justifyContent="flex-start"
                  pl={
                    selectedCards.find((c) => c.name === card.name)
                      ? "auto"
                      : 10
                  }
                  leftIcon={
                    selectedCards.find((c) => c.name === card.name) ? (
                      <CheckIcon />
                    ) : undefined
                  }
                  onClick={() =>
                    setSelectedCards((prev) => {
                      const cardExists = prev.includes(card);

                      if (cardExists) {
                        return prev.filter((c) => c !== card);
                      } else {
                        return [...prev, card].sort((a, b) => {
                          const nameA = a.name.toLowerCase();
                          const nameB = b.name.toLowerCase();

                          if (nameA < nameB) {
                            return -1;
                          }
                          if (nameA > nameB) {
                            return 1;
                          }
                          return 0;
                        });
                      }
                    })
                  }
                >
                  {card.name}
                </Button>
              ))}
          </VStack>
        </Box>
      </VStack>
      <Divider height="100%" orientation="vertical" mx={5} />
      <Box overflowY="auto" flexGrow={2}>
        {selectedCards.length === 0 && (
          <AbsoluteCenter axis="horizontal">
            <SlideFade in={selectedCards.length === 0}>
              <Tag mt={2}>
                <TagLeftIcon as={ArrowBackIcon} />
                <TagLabel>Select some characters to compare!</TagLabel>
              </Tag>
            </SlideFade>
          </AbsoluteCenter>
        )}
        <SlideFade in={selectedCards.length > 0}>
          <SimpleGrid minChildWidth={300} spacing={2}>
            {selectedCards.map((card, i) => (
              <CharacterCard
                character={card}
                key={i}
                sx={{
                  transform: "scale(0.96)",
                  transition: "all 0.2s ease-in-out",
                  _hover: {
                    transform: "scale(1)",
                  },
                }}
              />
            ))}
          </SimpleGrid>
        </SlideFade>
      </Box>
    </Flex>
  );
}
