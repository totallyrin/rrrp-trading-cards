"use client";

import { useSession } from "next-auth/react";
import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { User } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { fetchAllUsers, updateUser } from "@/app/lib/data";
import { Search2Icon } from "@chakra-ui/icons";

export default function Admin() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>();
  const [searchText, setSearchText] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchAllUsers()
      .then((users) => {
        setUsers(users as User[]);
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
            placeholder="Search by name"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </InputGroup>
      </Box>
      <TableContainer width="100%">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th textAlign="center">Admin</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users
              ?.filter((user) => {
                if (searchText === "") return true;
                return user.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
              })
              .map((user) => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>
                    <Center>
                      <Checkbox
                        isChecked={user.admin}
                        onChange={(e) => {
                          const updatedUsers = users.map((u) => {
                            if (u.id === user.id) {
                              return { ...u, admin: e.target.checked };
                            }
                            return u;
                          });
                          setUsers(updatedUsers);
                        }}
                      />
                    </Center>
                  </Td>
                  <Td isNumeric>
                    <Button
                      size="xs"
                      onClick={() => {
                        updateUser(user)
                          .then(() => {
                            toast({
                              title: `${user.name} saved.`,
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                          })
                          .catch((e) => {
                            console.error(e);
                            toast({
                              title: `${user.name} failed to save.\n${e}`,
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          });
                      }}
                    >
                      SAVE
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
