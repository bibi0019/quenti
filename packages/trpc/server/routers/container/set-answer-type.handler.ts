import type { NonNullableUserContext } from "../../lib/types";
import type { TSetAnswerTypeSchema } from "./set-answer-type.schema";

type SetAnswerTypeOptions = {
  ctx: NonNullableUserContext;
  input: TSetAnswerTypeSchema;
};

export const setAnswerTypeHandler = async ({ ctx, input }: SetAnswerTypeOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet", // or another relevant container type
      },
    },
    data: {
      answerType: input.answerType,
    },
  });
};

export default setAnswerTypeHandler;