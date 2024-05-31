"use client";

import { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchAllCards } from "@/app/lib/data";
import {
  Button,
  Center,
  Heading,
  SlideFade,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import CharacterCard from "@/components/CharacterCard";
import { ChevronRightIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

export default function Home() {
  const [card, setCard] = useState<CardType | undefined>(undefined);

  useEffect(() => {
    fetchAllCards()
      .then((cards) => {
        const index =
          Math.round(
            (new Date().getTime() - new Date(0).getTime()) / (1000 * 3600 * 24),
          ) % cards.length;
        setCard(cards[index] as CardType);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <VStack overflowY="auto" height="100%">
      <Heading size="2xl">Card of the Day</Heading>
      {card ? (
        <SlideFade in={!!card}>
          <CharacterCard character={card} sx={{ my: 3 }} />
        </SlideFade>
      ) : (
        <Center my={50}>
          <Spinner size="xl" thickness="3px" />
        </Center>
      )}
      <Button
        as={NextLink}
        href="/gallery"
        rightIcon={<ChevronRightIcon />}
        py={3}
      >
        See all cards
      </Button>
    </VStack>
  );
}
