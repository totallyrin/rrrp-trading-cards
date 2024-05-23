"use client";

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  SlideFade,
  Tag,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card as CardType } from "@/utils/types";
import { fetchUserCards } from "@/app/lib/data";
import CharacterCard from "@/components/CharacterCard";
import { EditIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

export default function Account() {
  const { data: session } = useSession();
  const [showEmail, setShowEmail] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    if (session?.user.name)
      fetchUserCards(session.user.name)
        .then((cards) => {
          setCards(cards as CardType[]);
        })
        .catch((error) => {
          console.error(error);
        });
  }, [session]);

  if (session === null)
    return (
      <VStack height="100%" pt={10}>
        <Text textAlign="center" mb={3}>
          You must be signed in to view your account.
        </Text>
        <Button onClick={() => signIn()}>Click here to sign in!</Button>
      </VStack>
    );

  return (
    <VStack height="100%" p={2}>
      <SkeletonCircle isLoaded={!!session} size="125">
        <Avatar
          name={session?.user.name ?? ""}
          src={session?.user.image ?? ""}
          size="2xl"
        />
      </SkeletonCircle>
      {session ? (
        <Heading>{session?.user.name}</Heading>
      ) : (
        <SkeletonText
          noOfLines={1}
          skeletonHeight={10}
          width={200}
          mt={1}
          borderRadius="md"
        />
      )}
      {session ? (
        <Tooltip
          label={`Click to ${showEmail ? "hide" : "show"} email`}
          closeOnClick={false}
        >
          <Badge mb={1} onClick={() => setShowEmail(!showEmail)}>
            {showEmail
              ? session?.user.email
              : session?.user.email?.replace(
                  /(@[^@](?=[^@]*$)|\.[^.]+$)|./g,
                  (x, y) => y || "*",
                )}
          </Badge>
        </Tooltip>
      ) : (
        <SkeletonText
          noOfLines={1}
          skeletonHeight={5}
          width={[350, 400]}
          my={0.5}
          borderRadius="md"
        />
      )}
      {session ? (
        <Tag>{session?.user.role.toUpperCase()}</Tag>
      ) : (
        <Skeleton width={75} height={6} />
      )}
      <SlideFade in={cards.length > 0}>
        <VStack>
          <Divider my={1} />
          {/*<Heading size="md" mb={1}>*/}
          {/*  Your Cards*/}
          {/*</Heading>*/}
          <Flex width="100%" justifyContent="space-around" flexWrap="wrap">
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
          </Flex>
          <Button
            as={NextLink}
            href={"/characters"}
            rightIcon={<EditIcon />}
            mt={1}
          >
            Manage your characters
          </Button>
        </VStack>
      </SlideFade>
    </VStack>
  );
}
