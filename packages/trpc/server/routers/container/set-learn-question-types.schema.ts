import { z } from "zod";

export const ZSetLearnQuestionTypesSchema = z.object({
  entityId: z.string(),
  learnQuestionTypes: z.array(z.enum(["choice", "write"])),
});

export type TSetLearnQuestionTypesSchema = z.infer<
  typeof ZSetLearnQuestionTypesSchema
>;
