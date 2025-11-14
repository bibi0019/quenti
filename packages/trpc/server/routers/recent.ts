import { z } from "zod";

import type { SetFolderEntity } from "@quenti/interfaces";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getBelongingClasses } from "./classes/utils/get-belonging";
import { getRecentFolders } from "./folders/utils/recent";
import { getRecentDrafts, getRecentStudySets } from "./study-sets/utils/recent";

const ZRecentGetSchema = z
  .object({
    entityTypes: z.array(z.enum(["set", "folder", "draft"])).optional(),
    includeDrafts: z.boolean().optional(),
    includeClasses: z.boolean().optional(),
    allStudySets: z.boolean().optional(),
  })
  .optional();

export const recentRouter = createTRPCRouter({
  get: protectedProcedure
    .input(ZRecentGetSchema)
    .query(async ({ ctx, input }) => {
      const entityTypes = input?.entityTypes;
      const hasEntityTypeFilters = entityTypes !== undefined;
      const includeNonDraftSets =
        !hasEntityTypeFilters || entityTypes.includes("set");
      const includeDrafts =
        input?.includeDrafts ??
        (!hasEntityTypeFilters || entityTypes.includes("draft"));
      const includeFolders =
        !hasEntityTypeFilters || entityTypes.includes("folder");
      const includeClasses = input?.includeClasses ?? true;
      const allStudySets = input?.allStudySets ?? false;

      const [sets, folders, drafts, classes] = await Promise.all([
        includeNonDraftSets
          ? getRecentStudySets(ctx.prisma, ctx.session!.user.id, undefined, allStudySets ? undefined : 16)
          : Promise.resolve(
              [] as Awaited<ReturnType<typeof getRecentStudySets>>,
            ),
        includeFolders
          ? getRecentFolders(ctx.prisma, ctx.session!.user.id)
          : Promise.resolve([] as Awaited<ReturnType<typeof getRecentFolders>>),
        includeDrafts
          ? getRecentDrafts(ctx.prisma, ctx.session!.user.id)
          : Promise.resolve([] as Awaited<ReturnType<typeof getRecentDrafts>>),
        includeClasses
          ? getBelongingClasses(ctx.session!.user.id)
          : Promise.resolve(
              [] as Awaited<ReturnType<typeof getBelongingClasses>>,
            ),
      ]);

      const filteredSets = includeNonDraftSets ? sets : [];
      const filteredDrafts = includeDrafts ? drafts : [];
      const filteredFolders = includeFolders ? folders : [];
      const filteredClasses = includeClasses ? classes : [];

      const entities = new Array<SetFolderEntity>();

      for (const set of filteredSets) {
        entities.push({
          ...set,
          entityType: "set",
          slug: null,
          numItems: set._count.terms,
          inFolder: set.inFolder,
        });
      }
      for (const draft of filteredDrafts) {
        entities.push({
          ...draft,
          draft: true,
          entityType: "set",
          viewedAt: draft.savedAt,
          slug: null,
          numItems: draft._count.terms,
        });
      }
      for (const folder of filteredFolders) {
        entities.push({
          ...folder,
          entityType: "folder",
          numItems: folder._count.studySets,
        });
      }

      return {
        sets: filteredSets,
        folders: filteredFolders,
        classes: filteredClasses,
        entities: entities
          .sort((a, b) => {
            const tA = new Date(a.viewedAt || a.createdAt).getTime();
            const tB = new Date(b.viewedAt || b.createdAt).getTime();
            return tB - tA;
          })
          .slice(allStudySets ? undefined : 0, allStudySets ? undefined : 16),
        drafts: filteredDrafts,
      };
    }),
});
