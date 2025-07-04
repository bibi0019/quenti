import React from "react";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconLayoutGrid, IconPencil } from "@tabler/icons-react";

import { useSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";

const typeConfig = {
  choice: {
    label: "Multiple choice",
    Icon: IconLayoutGrid,
  },
  write: {
    label: "Written",
    Icon: IconPencil,
  },
} as const;

export const QuestionTypeSection: React.FC = () => {
  const { id } = useSet();
  const questionTypes = useContainerContext((s) => s.learnQuestionTypes);
  const setQuestionTypes = useContainerContext((s) => s.setLearnQuestionTypes);
  const apiMutation = api.container.setLearnQuestionTypes.useMutation();

  const toggle = (type: "choice" | "write") => {
    const next = questionTypes.includes(type)
      ? questionTypes.filter((t) => t !== type)
      : [...questionTypes, type];
    setQuestionTypes(next);
    apiMutation.mutate({ entityId: id, learnQuestionTypes: next });
  };

  const selectedBorder = useColorModeValue("blue.600", "blue.200");
  const defaultBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing="3">
      {(Object.keys(typeConfig) as ("choice" | "write")[]).map((type) => {
        const { label, Icon } = typeConfig[type];
        const checked = questionTypes.includes(type);
        return (
          <GridItem key={type}>
            <Button
              w="full"
              variant="outline"
              rounded="xl"
              bg="transparent"
              borderWidth="2px"
              borderColor={checked ? selectedBorder : defaultBorder}
              py="6"
              px="4"
              colorScheme="gray"
              onClick={() => toggle(type)}
            >
              <HStack w="full">
                <Box
                  transition="color 0.15s ease-in-out"
                  color={checked ? selectedBorder : "gray.400"}
                  _dark={{ color: checked ? selectedBorder : "gray.500" }}
                >
                  <Icon size={20} />
                </Box>
                <Text fontWeight={600}>{label}</Text>
              </HStack>
            </Button>
          </GridItem>
        );
      })}
    </SimpleGrid>
  );
};
