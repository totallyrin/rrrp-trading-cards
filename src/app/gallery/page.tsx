"use client";

import { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchAllCards } from "@/app/lib/data";
import CharacterCard from "@/components/CharacterCard";
import { Center, SimpleGrid, SlideFade, Spinner } from "@chakra-ui/react";

export default function Gallery() {
  const [cards, setCards] = useState<CardType[]>([]);

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
    <SlideFade in={cards.length > 0}>
      <SimpleGrid minChildWidth={300} spacing={2} width="100%">
        {cards.map((card, i) => (
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
  );
}
