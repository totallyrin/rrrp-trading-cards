"use client";

import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { permanentRedirect, useSearchParams } from "next/navigation";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
// @ts-ignore
import { BuiltInProviderType } from "next-auth/providers";

export default function SignIn() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>();

  useEffect(() => {
    getProviders().then((providers) => {
      setLoading(false);
      setProviders(providers);
    });
  }, []);

  if (session) {
    permanentRedirect(searchParams.entries().next().value[1] ?? "/");
  }

  if (session === undefined)
    return (
      <Center height="100%">
        <Spinner size="xl" thickness="3px" />
      </Center>
    );

  return (
    <Center height="100%">
      <VStack
        flexDirection="column"
        // height={["100%", "75%", "50%"]}
        justifyContent="center"
        alignContent="center"
        width={["100%", "75%", "50%"]}
      >
        <Card width="100%" height="100%">
          <CardHeader justifyContent="center">
            <Center>
              <Heading size="xl">Sign in</Heading>
            </Center>
          </CardHeader>
          <CardBody>
            <Center>
              {!isLoading ? (
                <VStack>
                  {providers &&
                    Object.values(providers).map((provider) => (
                      <Button
                        key={provider.name}
                        variant={provider.id}
                        onClick={() => signIn(provider.id)}
                        leftIcon={
                          provider.id === "discord" ? (
                            <DiscordIcon />
                          ) : undefined
                        }
                        rightIcon={<ChevronRightIcon />}
                        py={3}
                      >
                        Sign in with {provider.name}
                      </Button>
                    ))}
                </VStack>
              ) : (
                <Spinner size="xl" thickness="3px" />
              )}
            </Center>
          </CardBody>
          <CardFooter>
            <Center width="100%">
              <Button as={NextLink} href="/" leftIcon={<ArrowBackIcon />}>
                Back
              </Button>
            </Center>
          </CardFooter>
        </Card>
      </VStack>
    </Center>
  );
}
