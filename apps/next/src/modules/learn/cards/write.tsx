import { useSession } from "next-auth/react";
import { log } from "next-axiom";
import React from "react";

import type { Question } from "@quenti/interfaces";

import { useAuthedSet } from "../../../hooks/use-set";
import { useContainerContext } from "../../../stores/use-container-store";
import { useLearnContext } from "../../../stores/use-learn-store";
import { word } from "../../../utils/terms";
import { CorrectState } from "./write/correct-state";
import { IncorrectState } from "./write/incorrect-state";
import { InputState } from "./write/input-state";
import { RetypeAnswerState } from "./write/retype-answer-state";
import { UnknownPartialState } from "./write/unknown-partial-state";

export interface WriteCardProps {
  active: Question;
}

export const WriteCard: React.FC<WriteCardProps> = ({ active }) => {
  const status = useLearnContext((s) => s.status);
  const isRetyping = useLearnContext((s) => s.isRetyping);
  const startRetyping = useLearnContext((s) => s.startRetyping);
  const session = useSession();
  const { container } = useAuthedSet();
  const requireRetyping = useContainerContext((s) => s.requireRetyping);
  const [guess, setGuess] = React.useState<string | undefined>();
  const [showRetyping, setShowRetyping] = React.useState(false);

  const [start] = React.useState(Date.now());

  React.useEffect(() => {
    if (["correct", "incorrect"].includes(status as string)) {
      const elapsed = Date.now() - start;

      log.info(`learn.write.${status}`, {
        userId: session.data?.user?.id,
        containerId: container.id,
        termId: active.term.id,
        guess,
        answer: word(active.answerMode, active.term, "answer"),
        skipped: !guess,
        elapsed,
      });

      // If the answer is incorrect and requireRetyping is enabled, set up retyping state
      if (status === "incorrect" && requireRetyping && !isRetyping) {
        const correctAnswer = word(active.answerMode, active.term, "answer");
        // Immediately switch to retyping mode without showing the incorrect state
        startRetyping(correctAnswer);
        setShowRetyping(true);
      }
      // If requireRetyping is disabled, we'll just show the incorrect state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, active.term.id, requireRetyping]);

  if (isRetyping && showRetyping) {
    return (
      <RetypeAnswerState
        active={active}
        guess={guess}
        onComplete={() => setShowRetyping(false)}
      />
    );
  }

  if (status === "correct")
    return <CorrectState guess={guess || ""} active={active} />;
  if (status === "incorrect")
    return <IncorrectState active={active} guess={guess} />;
  if (status === "unknownPartial")
    return <UnknownPartialState active={active} guess={guess} />;

  return <InputState active={active} onSubmit={setGuess} />;
};
