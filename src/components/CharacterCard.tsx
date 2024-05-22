import { Card as Character } from "@/utils/types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Spacer,
  SystemStyleObject,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/next-js";

export default function CharacterCard({
  character,
  sx,
}: {
  character: Character;
  sx: SystemStyleObject | undefined;
}) {
  return (
    <Card
      variant="filled"
      sx={{
        ...sx,
      }}
    >
      <CardHeader>
        <Flex justifyContent="space-between" height="100%">
          <Heading size="sm">{character.name}</Heading>
          {character.pronouns.trim() !== "" && (
            <HStack>
              <Divider orientation="vertical" mx={1} />
              <Heading size="xs" textAlign="right">
                {character.pronouns}
              </Heading>
            </HStack>
          )}
        </Flex>
      </CardHeader>

      {character.image ? (
        <Center
          borderWidth="3px"
          mx={4}
          borderRadius="md"
          position="relative"
          height={250}
        >
          <Image
            src={character.image}
            alt={character.name}
            fill
            borderRadius="sm"
          />
        </Center>
      ) : (
        <Spacer />
      )}

      <CardBody>
        <HStack height="100%">
          <VStack width="40%">
            <Heading size="xs" textAlign="center">
              Occupation
            </Heading>
            <Text fontSize="sm" textAlign="center">
              {character.occupation ?? "Unknown"}
            </Text>
            <Divider />
            <Heading size="xs" textAlign="center">
              Residence
            </Heading>
            <Text fontSize="sm" textAlign="center">
              {character.residence ?? "Unknown"}
            </Text>
            <Divider />
            <Heading size="xs" textAlign="center">
              Relationship status
            </Heading>
            <Text fontSize="sm" textAlign="center">
              {character.relationship_status ?? "Unknown"}
            </Text>
            {character.fact_file && <Divider />}
            {/*<Heading size="xs" textAlign="center">*/}
            {/*  Fun Fact*/}
            {/*</Heading>*/}
            <Text as="i" fontSize="sm" textAlign="center">
              {character.fact_file}
            </Text>
          </VStack>
          <Divider orientation="vertical" mx={1} />
          <VStack flexGrow={1}>
            <HStack justifyContent="space-between" width="100%">
              <Heading size="xs">Strength</Heading>
              <Text>{character.strength}</Text>
            </HStack>
            <Divider orientation="horizontal" />
            <HStack justifyContent="space-between" width="100%">
              <Heading size="xs">Comedic Timing</Heading>
              <Text>{character.comedic_timing}</Text>
            </HStack>
            <Divider orientation="horizontal" />
            <HStack justifyContent="space-between" width="100%">
              <Heading size="xs">Dirty Minded</Heading>
              <Text>{character.dirty_minded}</Text>
            </HStack>
            <Divider orientation="horizontal" />
            <HStack justifyContent="space-between" width="100%">
              <Heading size="xs">Accident Prone</Heading>
              <Text>{character.accident_prone}</Text>
            </HStack>
            <Divider orientation="horizontal" />
            <HStack justifyContent="space-between" width="100%">
              <Heading size="xs">Rizz</Heading>
              <Text>{character.rizz}</Text>
            </HStack>
            <Divider orientation="horizontal" />
            <HStack justifyContent="space-between" width="100%">
              <Heading size="xs">Serving</Heading>
              <Text>{character.serving_cunt}</Text>
            </HStack>
          </VStack>
        </HStack>
      </CardBody>

      <CardFooter pt={0}>
        <Text as="cite">{character.quote}</Text>
      </CardFooter>
    </Card>
  );
}
