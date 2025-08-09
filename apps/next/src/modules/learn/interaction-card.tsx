import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Display } from "@quenti/components/display";
import { api } from "@quenti/trpc";

import {
  Box,
  Card,
  Fade,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconEditCircle, IconStar, IconStarFilled } from "@tabler/icons-react";

import { SetCreatorOnly } from "../../components/set-creator-only";
import { SquareAssetPreview } from "../../components/terms/square-asset-preview";
import { useAuthedSet } from "../../hooks/use-set";
import { useContainerContext } from "../../stores/use-container-store";
import { useLearnContext } from "../../stores/use-learn-store";
import { richWord } from "../../utils/terms";
import { ChoiceCard } from "./cards/choice";
import { WriteCard } from "./cards/write";

const EditTermModal = dynamic(
  () =>
    import("../../components/edit-term-modal").then((mod) => mod.EditTermModal),
  { ssr: false },
);

export const InteractionCard = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [focusDefinition, setFocusDefinition] = useState(false);

  const timeline = useLearnContext((s) => s.roundTimeline);
  const termsThisRound = useLearnContext((s) => s.termsThisRound);
  const roundCounter = useLearnContext((s) => s.roundCounter);
  const roundProgress = useLearnContext((s) => s.roundProgress);
  const prevTermWasIncorrect = useLearnContext((s) => s.prevTermWasIncorrect);
  const status = useLearnContext((s) => s.status);

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const starTerm = useContainerContext((s) => s.starTerm);
  const unstarTerm = useContainerContext((s) => s.unstarTerm);
  const { container } = useAuthedSet();

  const starMutation = api.container.starTerm.useMutation();
  const unstarMutation = api.container.unstarTerm.useMutation();

  const correctColor = useColorModeValue("#38a169", "#68d391");
  const incorrectColor = useColorModeValue("#e53e3e", "#fc8181");
  const neutralColor = useColorModeValue("#0042da", "#7ea6ff");

  const active = timeline[roundCounter];
  if (!active) return null;

  const starred = starredTerms.includes(active.term.id);
  const Star = starred ? IconStarFilled : IconStar;

  const onRequestEdit = () => {
    setFocusDefinition(false);
    setEditModalOpen(true);
  };
  const onRequestStar = () => {
    if (!starred) {
      starTerm(active.term.id);
      starMutation.mutate({
        termId: active.term.id,
        containerId: container.id,
      });
    } else {
      unstarTerm(active.term.id);
      unstarMutation.mutate({
        termId: active.term.id,
      });
    }
  };

  return (
    <>
      <motion.div
        key={active.term.id}
        initial={{ translateY: -20, opacity: 0.5 }}
        animate={{ translateY: 0, opacity: 1 }}
        style={{
          marginBottom: 100,
        }}
      >
        <Card
          shadow="xl"
          bg="white"
          borderWidth="2px"
          borderColor="gray.100"
          _dark={{
            bg: "gray.750",
            borderColor: "gray.700",
          }}
          rounded="2xl"
          position="relative"
        >
          <Flex position="absolute" top="6" right="6" zIndex={10}>
            <HStack spacing={4}>
              <SetCreatorOnly studySetId={active.term.studySetId}>
                <IconButton
                  icon={<IconEditCircle />}
                  aria-label="Edit"
                  rounded="full"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestEdit();
                  }}
                />
              </SetCreatorOnly>
              <IconButton
                icon={<Star />}
                aria-label="Star"
                rounded="full"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestStar();
                }}
              />
            </HStack>
          </Flex>
          {status !== undefined && (
            <Fade
              in
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
              }}
              transition={{
                enter: {
                  duration: 0.3,
                },
              }}
            >
              <Box
                w="full"
                h="full"
                background="red"
                rounded="2xl"
                boxShadow={`0 5px 60px -5px ${
                  status == "correct"
                    ? correctColor
                    : status == "incorrect"
                      ? incorrectColor
                      : neutralColor
                }`}
                opacity="0.2"
                zIndex={300}
              />
            </Fade>
          )}
          <Box w="full" h="full" rounded="2xl" overflow="hidden">
            <motion.div
              style={{
                overflow: "hidden",
              }}
              initial={{
                width: `calc(100% * ${Math.max(
                  roundProgress - (prevTermWasIncorrect ? 0 : 1),
                  0,
                )} / ${termsThisRound})`,
              }}
              animate={{
                width: `calc(100% * ${roundProgress} / ${termsThisRound})`,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <Box height="1" w="full" bg="orange.300" />
            </motion.div>
            <Stack spacing={6} px="8" py="6">
              <HStack spacing="3">
                <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
                  {active.answerMode == "Definition" ? "Term" : "Definition"}
                </Text>
                <Box
                  bg="transparent"
                  borderWidth="2px"
                  borderColor="gray.100"
                  _dark={{
                    borderColor: "gray.600",
                  }}
                  py="1"
                  px="3"
                  rounded="full"
                  visibility={
                    active.term.correctness === -2 ? "visible" : "hidden"
                  }
                >
                  <Text fontSize="xs" fontWeight={600}>
                    Let&apos;s try again
                  </Text>
                </Box>
              </HStack>
              <Box minH={{ base: "60px", md: "140px" }}>
                <Flex gap="4" justifyContent="space-between">
                  <Text
                    fontSize="xl"
                    whiteSpace="pre-wrap"
                    overflowWrap="anywhere"
                  >
                    <Display
                      {...richWord(active.answerMode, active.term, "prompt")}
                    />
                  </Text>
                  {active.answerMode == "Word" && active.term.assetUrl && (
                    <SquareAssetPreview
                      rounded={8}
                      size={100}
                      src={active.term.assetUrl}
                    />
                  )}
                </Flex>
              </Box>
              {active.type == "choice" ? (
                <ChoiceCard active={active} />
              ) : (
                <WriteCard active={active} />
              )}
            </Stack>
          </Box>
        </Card>
      </motion.div>

      {/* Add the edit modal component */}
      <EditTermModal
        term={active.term}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onDefinition={focusDefinition}
      />
    </>
  );
};
