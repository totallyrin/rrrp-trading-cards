"use client";

import {
  Avatar,
  Badge,
  Button,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tag,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function Account() {
  const { data: session } = useSession();
  const [showEmail, setShowEmail] = useState(false);

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
    </VStack>
  );
}
