import { fetchAllCards } from "@/app/lib/data";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Card as CardType } from "@/utils/types";
import { Image } from "@chakra-ui/next-js";

export default function CardGallery() {
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

  return (
    <SimpleGrid minChildWidth={300} spacing={4} width="100%">
      {cards.map((card, i) => (
        <Card
          key={i}
          variant="filled"
          sx={{
            transform: "scale(0.95)",
            transition: "all 0.2s ease-in-out",
            _hover: {
              transform: "scale(1)",
            },
          }}
        >
          <CardHeader>
            <Flex justifyContent="space-between" height="100%">
              <Heading size="sm">{card.name}</Heading>
              {card.pronouns.trim() !== "" && (
                <HStack>
                  <Divider orientation="vertical" mx={1} />
                  <Heading size="xs" textAlign="right">
                    {card.pronouns}
                  </Heading>
                </HStack>
              )}
            </Flex>
          </CardHeader>

          {card.img && (
            <Image
              src={`data:jpeg;base64,${card.img}`}
              alt={card.name}
              height={50}
              width={50}
            />
          )}

          <CardBody>
            <HStack height="100%">
              <VStack flexGrow={1}>
                <HStack justifyContent="space-between" width="100%">
                  <Heading size="xs">Strength</Heading>
                  <Text>{card.strength}</Text>
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between" width="100%">
                  <Heading size="xs">Comedic Timing</Heading>
                  <Text>{card.comedic_timing}</Text>
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between" width="100%">
                  <Heading size="xs">Dirty Minded</Heading>
                  <Text>{card.dirty_minded}</Text>
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between" width="100%">
                  <Heading size="xs">Accident Prone</Heading>
                  <Text>{card.accident_prone}</Text>
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between" width="100%">
                  <Heading size="xs">Rizz</Heading>
                  <Text>{card.rizz}</Text>
                </HStack>
                <Divider orientation="horizontal" />
                <HStack justifyContent="space-between" width="100%">
                  <Heading size="xs">Serving Cunt</Heading>
                  <Text>{card.serving_cunt}</Text>
                </HStack>
              </VStack>
              {card.fact_file && (
                <>
                  <Divider orientation="vertical" mx={1} />
                  <VStack>
                    <Heading size="xs">Fact File</Heading>
                    <Text>{card.fact_file}</Text>
                  </VStack>
                </>
              )}
            </HStack>
          </CardBody>

          <CardFooter></CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
}
