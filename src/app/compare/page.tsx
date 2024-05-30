"use client";

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
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
import { ArrowBackIcon, CheckIcon, Search2Icon } from "@chakra-ui/icons";
import CharacterCard from "@/components/CharacterCard";

export default function Compare() {
  const [mobile] = useMediaQuery("(orientation: portrait)");
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
      <Center height="100%">
        <Spinner size="xl" thickness="3px" />
      </Center>
    );

  return (
    <Flex height="100%">
      <VStack>
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
        <Box height="92%" overflowY="auto" width="100%">
          <VStack width="100%" pr={3}>
            {cards
              .filter((c) => c.name.toLowerCase().includes(searchText))
              .map((card) => (
                <Button
                  key={card.name}
                  width="100%"
                  variant="ghost"
                  justifyContent="space-between"
                  pr={
                    selectedCards.find((c) => c.name === card.name)
                      ? "auto"
                      : 10
                  }
                  rightIcon={
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
      <Box height="92%" overflowY="auto" flexGrow={1}>
        <SlideFade in={selectedCards.length === 0}>
          {selectedCards.length === 0 && (
            <Tag mt={2}>
              <TagLeftIcon as={ArrowBackIcon} />
              <TagLabel>Select some characters to compare!</TagLabel>
            </Tag>
          )}
        </SlideFade>
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
