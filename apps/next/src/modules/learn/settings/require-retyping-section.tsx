import React from "react";

import { api } from "@quenti/trpc";

import { Flex, Stack, Switch, Text, useColorModeValue } from "@chakra-ui/react";

import { useSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";

export const RequireRetypingSection = () => {
  const { id } = useSet();
  const requireRetyping = useContainerContext((s) => s.requireRetyping);
  const setRequireRetyping = useContainerContext((s) => s.setRequireRetyping);

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const apiRequireRetyping = api.container.setRequireRetyping.useMutation();

  return (
    <Flex gap={{ base: 4, sm: 8 }} flexDir={{ base: "column", sm: "row" }}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Require re-typing correct answer</Text>
        <Text fontSize="sm" color={mutedColor}>
          Require re-typing of correct answer after an incorrect response
        </Text>
      </Stack>
      <Switch
        size="lg"
        isChecked={requireRetyping}
        onChange={(e) => {
          setRequireRetyping(e.target.checked);
          apiRequireRetyping.mutate({
            entityId: id,
            requireRetyping: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};
