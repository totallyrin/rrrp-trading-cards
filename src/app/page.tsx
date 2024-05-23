"use client";

import { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchAllCards } from "@/app/lib/data";
import { Button, Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import CharacterCard from "@/components/CharacterCard";
import { ChevronRightIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

export default function Home() {
  const [card, setCard] = useState<CardType | undefined>(undefined);

  useEffect(() => {
    fetchAllCards()
      .then((cards) => {
        const currentDate = new Date();
        const dayNumber = currentDate.getDay();
        setCard(cards[dayNumber % cards.length] as CardType);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <VStack py={10} height="100%">
      <Heading mb={10}>Card of the Day</Heading>
      {card ? (
        <CharacterCard
          character={card}
          sx={{
            transform: "scale(1)",
            transition: "all 0.2s ease-in-out",
            _hover: {
              transform: "scale(1.1)",
            },
          }}
        />
      ) : (
        <Center flexGrow={1}>
          <Spinner />
        </Center>
      )}
      <Button
        as={NextLink}
        href="/Gallery"
        rightIcon={<ChevronRightIcon />}
        mt={10}
      >
        See all cards
      </Button>
    </VStack>
  );
}
