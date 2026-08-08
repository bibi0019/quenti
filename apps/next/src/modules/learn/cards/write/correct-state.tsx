import { motion } from "framer-motion";
import React from "react";

import { GenericLabel } from "@quenti/components";
import { cleanSpaces } from "@quenti/core/evaluator";
import type { Question } from "@quenti/interfaces";
import { getRandom } from "@quenti/lib/array";

import { Flex, Stack } from "@chakra-ui/react";

import { useLearnContext } from "../../../../stores/use-learn-store";
import { ThirdSideButton } from "../../third-side-button";
import { AnswerCard } from "./answer-card";

export interface CorrectStateProps {
  guess: string;
  active: Question;
}

export const CorrectState: React.FC<CorrectStateProps> = ({
  guess,
  active,
}) => {
  const feedbackBank = useLearnContext((s) => s.feedbackBank);

  const [remark] = React.useState(getRandom(feedbackBank.correct));

  return (
    <motion.div
      initial={{
        translateY: -16,
        opacity: 0.5,
      }}
      animate={{
        translateY: 0,
        opacity: 1,
      }}
    >
      <Stack spacing="2" pb="4">
        <GenericLabel evaluation>{remark}</GenericLabel>
        <AnswerCard text={cleanSpaces(guess)} correct />
        <Flex justify="center" pt={2}>
          <ThirdSideButton term={active.term} />
        </Flex>
      </Stack>
    </motion.div>
  );
};
