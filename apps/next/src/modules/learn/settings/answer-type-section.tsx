import { api } from "@quenti/trpc";

import { Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { SelectAnswerType } from "../../../components/select-answer-type";
import { useSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";
import { useLearnContext } from "../../../stores/use-learn-store";

export const AnswerTypeSection = () => {
  const { id } = useSet();
  const answerType = useContainerContext((s) => s.answerType);
  const setAnswerType = useContainerContext((s) => s.setAnswerType);

  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const apiAnswerType = api.container.setAnswerType.useMutation();

  return (
    <Stack spacing={6}>
      <Stack spacing={0}>
        <Text fontWeight={600}>Answer Type</Text>
        <Text fontSize="sm" color={mutedColor}>
          Choose how to answer questions (This doesn't work yet!)
        </Text>
      </Stack>
      <SelectAnswerType
        value={answerType}
        onChange={async (v) => {
          setAnswerType(v);
          await apiAnswerType.mutateAsync({
            entityId: id,
            answerType: v,
          });
        }}
      />
    </Stack>
  );
};