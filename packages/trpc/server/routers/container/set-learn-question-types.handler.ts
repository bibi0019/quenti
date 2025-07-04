import type { NonNullableUserContext } from "../../lib/types";
import type { TSetLearnQuestionTypesSchema } from "./set-learn-question-types.schema";

type SetLearnQuestionTypesOptions = {
  ctx: NonNullableUserContext;
  input: TSetLearnQuestionTypesSchema;
};

export const setLearnQuestionTypesHandler = async ({
  ctx,
  input,
}: SetLearnQuestionTypesOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: "StudySet",
      },
    },
    data: {
      learnQuestionTypes: JSON.stringify(input.learnQuestionTypes),
    },
  });
};

export default setLearnQuestionTypesHandler;
