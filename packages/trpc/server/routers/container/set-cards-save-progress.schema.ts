import { z } from "zod";

import { ContainerType } from "@quenti/prisma/client";

export const ZSetCardsSaveProgressSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  cardsSaveProgress: z.boolean(),
});

export type TSetCardsSaveProgressSchema = z.infer<
  typeof ZSetCardsSaveProgressSchema
>;
