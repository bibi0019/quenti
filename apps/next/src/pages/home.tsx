import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { HeadSeo } from "@quenti/components/head-seo";
import { api } from "@quenti/trpc";

import {
  Button,
  Container,
  Heading,
  Skeleton,
  Stack,
  Wrap,
} from "@chakra-ui/react";

import { LazyWrapper } from "../common/lazy-wrapper";
import { PageWrapper } from "../common/page-wrapper";
import { AuthedPage } from "../components/authed-page";
import { WithFooter } from "../components/with-footer";
import { getLayout } from "../layouts/main-layout";
import { ClassesGrid } from "../modules/home/classes-grid";
import { EmptyDashboard } from "../modules/home/empty-dashboard";
import { News } from "../modules/home/news";
import { SetGrid } from "../modules/home/set-grid";
import {
  HOME_FILTER_LABELS,
  HOME_FILTER_ORDER,
  type HomeFilter,
} from "../modules/home/types";

const Home = () => {
  const { status } = useSession();
  const [filter, setFilter] = useState<HomeFilter>("all");

  const { data, isLoading: recentLoading } = api.recent.get.useQuery({
    allStudySets: filter === "sets",
  });

  const availableFilters = useMemo(() => {
    if (!data) return HOME_FILTER_ORDER;

    const next: HomeFilter[] = ["all"];

    if ((data.sets?.length || 0) > 0) {
      next.push("sets");
    }

    if ((data.folders?.length || 0) > 0) {
      next.push("folders");
    }

    if ((data.classes?.length || 0) > 0) {
      next.push("classes");
    }

    return next;
  }, [data]);

  useEffect(() => {
    if (!availableFilters.includes(filter)) {
      setFilter("all");
    }
  }, [availableFilters, filter]);

  const hasContent = useMemo(() => {
    switch (filter) {
      case "sets":
        return (data?.sets.length || 0) > 0;
      case "folders":
        return (data?.folders.length || 0) > 0;
      case "classes":
        return (data?.classes.length || 0) > 0;
      case "all":
      default:
        return (
          (data?.entities.length || 0) > 0 || (data?.classes.length || 0) > 0
        );
    }
  }, [data, filter]);

  const isLoading = status == "unauthenticated" || recentLoading;
  const showEmptyState = !isLoading && !hasContent;
  const showRecentSection =
    !showEmptyState &&
    (isLoading ||
      (data?.entities.length || 0) > 0 ||
      availableFilters.some((value) => value !== "all"));

  return (
    <AuthedPage>
      <HeadSeo title="Home" />
      <LazyWrapper>
        <WithFooter>
          <Container maxW="7xl">
            <Stack spacing={12}>
              {!isLoading && showEmptyState && <EmptyDashboard />}
              {showRecentSection && (
                <Stack spacing={6}>
                  <Skeleton isLoaded={!!data} rounded="md" fitContent>
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      spacing={6}
                      align={{ base: "flex-start", md: "center" }}
                      justify="flex-start"
                    >
                      <Heading size="lg">Recent</Heading>
                      <Wrap spacing={2} shouldWrapChildren>
                        {availableFilters.map((value) => (
                          <Button
                            key={value}
                            size="sm"
                            onClick={() => setFilter(value)}
                            variant={filter === value ? "solid" : "outline"}
                            colorScheme="blue"
                            borderRadius="full"
                          >
                            {HOME_FILTER_LABELS[value]}
                          </Button>
                        ))}
                      </Wrap>
                    </Stack>
                  </Skeleton>
                  {filter !== "classes" && (
                    <SetGrid
                      data={data}
                      filter={filter}
                      isLoading={isLoading}
                    />
                  )}
                </Stack>
              )}
              <ClassesGrid data={data} filter={filter} />
              <News />
            </Stack>
          </Container>
        </WithFooter>
      </LazyWrapper>
    </AuthedPage>
  );
};

Home.getLayout = getLayout;
Home.PageWrapper = PageWrapper;

export default Home;
