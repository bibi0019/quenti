import { useSession } from "next-auth/react";

import type { RouterOutputs } from "@quenti/trpc";

import { Grid, GridItem, Heading, Skeleton, Stack } from "@chakra-ui/react";

import { ClassCard } from "../../components/class-card";
import { type HomeFilter } from "./types";

interface ClassesGridProps {
  data: RouterOutputs["recent"]["get"] | undefined;
  filter: HomeFilter;
}

export const ClassesGrid = ({ data, filter }: ClassesGridProps) => {
  const { status } = useSession();

  if (filter !== "all" && filter !== "classes") return null;

  if (!data?.classes.length || status === "loading") return null;

  return (
    <Stack spacing={6}>
      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">Your classes</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        {(data?.classes || []).map((class_) => (
          <GridItem key={class_.id}>
            <ClassCard
              key={class_.id}
              id={class_.id}
              name={class_.name}
              bannerColor={
                class_.preferences?.bannerColor ?? class_.bannerColor
              }
              data={{
                students: class_._count.members || 0,
                sections: class_._count.sections || 0,
                folders: class_._count.folders || 0,
                studySets: class_._count.studySets || 0,
              }}
              for={class_.as}
              logo={class_.logoUrl}
              hash={class_.logoHash}
            />
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
