"use client";

import { useSession } from "next-auth/react";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SlideFade,
  Spinner,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { VerifyImage } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { approveImage, deleteImage, fetchAllImages } from "@/app/lib/data";
import { Search2Icon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/next-js";

export default function Verify() {
  const { data: session } = useSession();
  const [images, setImages] = useState<VerifyImage[]>([]);
  const [searchText, setSearchText] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchAllImages()
      .then((imgs) => {
        setImages(imgs as VerifyImage[]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (session === undefined)
    return (
      <Center height="100%">
        <Spinner size="xl" thickness="3px" />
      </Center>
    );

  if (!session?.user.admin)
    return (
      <Center>
        <Badge textAlign="center" colorScheme="red">
          Admins only!1!!!!11!!!11!
        </Badge>
      </Center>
    );

  return (
    <VStack width="100%" height="100%">
      <Box
        sx={{
          // mb: 5,
          width: "100%",
        }}
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search by username or character name"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </InputGroup>
      </Box>
      <SlideFade in={images.length === 0}>
        <Center>
          <Tag mt={3}>No images found.</Tag>
        </Center>
      </SlideFade>
      <TableContainer width="100%" overflowY="scroll">
        <SlideFade in={images.length > 0}>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Character</Th>
                <Th>
                  <Center>Image</Center>
                </Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {images
                ?.filter((img) => {
                  if (searchText === "") return true;
                  return (
                    img.character
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    img.user.toLowerCase().includes(searchText.toLowerCase())
                  );
                })
                .map((img) => (
                  <Tr key={img.id}>
                    <Td>{img.user}</Td>
                    <Td>{img.character}</Td>
                    <Td>
                      <AspectRatio
                        borderWidth="3px"
                        mx={4}
                        borderRadius="md"
                        position="relative"
                        ratio={3 / 2}
                      >
                        <Image
                          src={img.image}
                          alt={img.character}
                          fill
                          sizes="450px"
                          priority={false}
                          borderRadius="sm"
                          sx={{
                            objectFit: "cover",
                          }}
                        />
                      </AspectRatio>
                    </Td>
                    <Td isNumeric>
                      <HStack justifyContent="flex-end">
                        <Button
                          colorScheme="green"
                          onClick={() => {
                            approveImage(img)
                              .then(() => {
                                setImages(
                                  images?.filter((i) => i.id !== img.id),
                                );
                                toast({
                                  title: `Image for ${img.character} approved.`,
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              })
                              .catch((e) => {
                                console.error(e);
                                toast({
                                  title: `Image for ${img.character} failed to save.\n${e}`,
                                  status: "error",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              });
                          }}
                        >
                          APPROVE
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            deleteImage(img)
                              .then(() => {
                                setImages(
                                  images?.filter((i) => i.id !== img.id),
                                );
                                toast({
                                  title: `Image for ${img.character} deleted.`,
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              })
                              .catch((e) => {
                                console.error(e);
                                toast({
                                  title: `Image for ${img.character} failed to delete.\n${e}`,
                                  status: "error",
                                  duration: 3000,
                                  isClosable: true,
                                });
                              });
                          }}
                        >
                          DELETE
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </SlideFade>
      </TableContainer>
    </VStack>
  );
}
