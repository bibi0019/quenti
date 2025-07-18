import type { NonNullableUserContext } from "../../lib/types";
import type { TSetCardsSaveProgressSchema } from "./set-cards-save-progress.schema";

type SetCardsSaveProgressOptions = {
  ctx: NonNullableUserContext;
  input: TSetCardsSaveProgressSchema;
};

export const setCardsSaveProgressHandler = async ({
  ctx,
  input,
}: SetCardsSaveProgressOptions) => {
  await ctx.prisma.container.update({
    where: {
      userId_entityId_type: {
        userId: ctx.session.user.id,
        entityId: input.entityId,
        type: input.type,
      },
    },
    data: {
      cardsSaveProgress: input.cardsSaveProgress,
    },
  });
};

export default setCardsSaveProgressHandler;
