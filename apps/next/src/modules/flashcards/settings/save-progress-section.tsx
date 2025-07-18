import { api } from "@quenti/trpc";

import { Flex, Stack, Switch, Text } from "@chakra-ui/react";

import { useSetFolderUnison } from "../../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../../stores/use-container-store";

export const SaveProgressSection = () => {
  const { id, entityType } = useSetFolderUnison();

  const cardsSaveProgress = useContainerContext((s) => s.cardsSaveProgress);
  const setCardsSaveProgress = useContainerContext(
    (s) => s.setCardsSaveProgress,
  );

  const apiSetCardsSaveProgress =
    api.container.setCardsSaveProgress.useMutation();

  return (
    <Flex gap={8} mt={2}>
      <Stack w="full">
        <Text fontWeight={700}>Save progress</Text>
      </Stack>
      <Switch
        size="lg"
        isChecked={cardsSaveProgress}
        onChange={(e) => {
          setCardsSaveProgress(e.target.checked);
          apiSetCardsSaveProgress.mutate({
            entityId: id,
            type: entityType == "set" ? "StudySet" : "Folder",
            cardsSaveProgress: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};
