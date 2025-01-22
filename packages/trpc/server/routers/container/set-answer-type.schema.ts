import { z } from "zod";
import { AnswerType } from "@prisma/client";

export const ZSetAnswerTypeSchema = z.object({
  entityId: z.string(),
  answerType: z.nativeEnum(AnswerType),
});

export type TSetAnswerTypeSchema = z.infer<typeof ZSetAnswerTypeSchema>;