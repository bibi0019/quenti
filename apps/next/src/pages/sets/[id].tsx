import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";
import { and, asc, db, eq, sql } from "@quenti/drizzle";
import { studySet, studySetCollaborator, term } from "@quenti/drizzle/schema";
import type { GetServerSidePropsContext } from "@quenti/types";

import { LazyWrapper } from "../../common/lazy-wrapper";
import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";

export const runtime = "experimental-edge";

const InternalSet = dynamic(() => import("../../components/internal-set"));

const Set = ({ set, collab }: inferSSRProps<typeof getServerSideProps>) => {
  return (
    <>
      {set && (
        <HeadSeo
          title={set?.title ?? "Not found"}
          description={set?.description ?? undefined}
          entity={{
            type: "StudySet",
            title: set.title,
            description: set.description,
            numItems: set.terms,
            collaborators: set.collaborators ?? undefined,
            user: {
              username: set.user.username!,
              image: set.user.image || "",
            },
          }}
          nextSeoProps={{
            noindex: set.visibility != "Public",
            nofollow: set.visibility != "Public",
          }}
        />
      )}
      <LazyWrapper>
        <InternalSet collab={collab} />
      </LazyWrapper>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const dbInstance = db;
  if (!dbInstance) return { props: { set: null, collab: false } };

  const set = await dbInstance.query.studySet.findFirst({
    where: eq(studySet.id, ctx.query?.id as string),
    columns: {
      id: true,
      type: true,
      title: true,
      description: true,
      visibility: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          image: true,
        },
      },
      collaborators: {
        orderBy: asc(studySetCollaborator.createdAt),
        limit: 5,
        with: {
          user: {
            columns: {
              image: true,
            },
          },
        },
      },
    },
  });

  if (!set || ["Private", "Class"].includes(set.visibility))
    return { props: { set: null, collab: set?.type == "Collab" } };

  const { count } = (
    await dbInstance
      .select({
        count: sql<number>`count(*)::bigint`,
      })
      .from(term)
      .where(and(eq(term.studySetId, set.id), eq(term.ephemeral, false)))
  )[0]!;

  let collaborators = null;

  if (set.type == "Collab") {
    const { total } = (
      await dbInstance
        .select({
          total: sql<number>`count(*)::bigint`,
        })
        .from(studySetCollaborator)
        .where(eq(studySetCollaborator.studySetId, set.id))
    )[0]!;

    collaborators = {
      total,
      avatars: set.collaborators
        .map(
          (c: { user: { image: string | null } }) => c.user.image || undefined,
        )
        .filter((img): img is string => Boolean(img)),
    };
  }

  return {
    props: {
      set: {
        ...set,
        terms: count,
        collaborators,
      },
      collab: set.type == "Collab",
    },
  };
};

Set.PageWrapper = PageWrapper;
Set.getLayout = getLayout;

export default Set;
