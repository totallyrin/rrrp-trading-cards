import { SimpleGrid } from "@chakra-ui/react";
import { Card as CardType } from "@/utils/types";
import CharacterCard from "@/components/CharacterCard";

export default function CardGallery({ cards }: { cards: CardType[] }) {
  return (
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
  );
}
