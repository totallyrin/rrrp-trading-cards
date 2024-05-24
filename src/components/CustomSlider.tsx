import {
  Box,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { Card as Character } from "@/utils/types";
import React from "react";

export default function CustomSlider({
  card,
  cards,
  setCards,
  title,
  attribute,
  color,
}: {
  card: Character;
  cards?: Character[];
  setCards:
    | React.Dispatch<React.SetStateAction<Character[]>>
    | React.Dispatch<React.SetStateAction<Character>>;
  title: string;
  attribute: keyof Character;
  color: string;
}) {
  return (
    <Box py={2} width="95%">
      <Heading size="xs" p={2} pb={0}>
        {title}
      </Heading>
      <Slider
        px={3}
        value={Number(card[attribute])}
        step={1}
        min={1}
        max={10}
        onChange={(e) => {
          if (cards) {
            const updatedCards = cards.map((c) => {
              if (c.id === card.id) {
                return { ...c, [attribute]: e };
              }
              return c;
            });
            // @ts-ignore
            setCards(updatedCards);
          } else {
            // @ts-ignore
            setCards({ ...card, [attribute]: e });
          }
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <SliderMark
            key={value}
            value={value}
            sx={{
              m: value === 10 ? 0.5 : 1,
              mt: 2,
              pl: value === 10 ? 0.5 : 1,
            }}
          >
            <Text fontSize="xs">{value}</Text>
          </SliderMark>
        ))}
        <SliderTrack>
          <SliderFilledTrack bg={color} />
        </SliderTrack>
        <SliderThumb ml={3} />
      </Slider>
    </Box>
  );
}
