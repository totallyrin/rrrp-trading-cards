"use client";

import React, { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchAllCards } from "@/app/lib/data";
import CharacterCard from "@/components/CharacterCard";
import {
  Box,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  SlideFade,
  Spinner,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

export default function Gallery() {
  const [cards, setCards] = useState<CardType[]>([]);
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
    <Box width="100%" height="100%">
      <Box
        sx={{
          mb: 5,
        }}
      >
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
      </Box>
      <Box height="92%" overflowY="auto">
        <SlideFade in={cards.length > 0}>
          <SimpleGrid minChildWidth={300} spacing={2}>
            {cards
              .filter((card) =>
                card.name.toLowerCase().includes(searchText.toLowerCase()),
              )
              .map((card, i) => (
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
    </Box>
  );
}
