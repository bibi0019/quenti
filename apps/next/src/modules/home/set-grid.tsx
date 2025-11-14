import { useSession } from "next-auth/react";

import type { RouterOutputs } from "@quenti/trpc";

import { Grid, GridItem } from "@chakra-ui/react";

import { FolderCard } from "../../components/folder-card";
import { GenericCard } from "../../components/generic-card";
import { StudySetCard } from "../../components/study-set-card";
import { type HomeFilter } from "./types";

interface SetGridProps {
  data: RouterOutputs["recent"]["get"] | undefined;
  filter: HomeFilter;
  isLoading: boolean;
}

export const SetGrid = ({ data, filter, isLoading }: SetGridProps) => {
  const { status } = useSession();
  const isPending = status == "unauthenticated" || isLoading;

  const entities = (() => {
    if (!data) return [];

    if (filter === "sets") {
      return data.entities.filter((entity) => entity.entityType === "set");
    }

    if (filter === "folders") {
      return data.entities.filter((entity) => entity.entityType === "folder");
    }

    return data.entities;
  })();

  if (data && !entities.length) return null;

  const displayedItems = entities.filter(
    (item) =>
      !(item.entityType === "set" && item.inFolder && filter !== "sets"),
  );

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
      {isPending &&
        Array.from({ length: displayedItems.length || 16 }).map((_, i) => (
          <GridItem h="156px" key={i}>
            <GenericCard.Skeleton />
          </GridItem>
        ))}
      {displayedItems.map((item) => (
        <GridItem key={item.id} h="156px">
          {item.entityType == "set" ? (
            <StudySetCard
              studySet={{
                ...item,
                visibility: item.visibility!,
                type: item.type!,
              }}
              collaborators={item.collaborators}
              draft={item.draft}
              numTerms={item.numItems}
              user={item.user}
            />
          ) : (
            <FolderCard
              folder={{ ...item }}
              numSets={item.numItems}
              user={item.user}
            />
          )}
        </GridItem>
      ))}
    </Grid>
  );
};
