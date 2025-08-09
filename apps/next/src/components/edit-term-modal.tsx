import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";

import { Modal } from "@quenti/components/modal";
import type { FacingTerm } from "@quenti/interfaces";
import {
  type EditorTerm,
  editorInput,
  getPlainText,
  hasRichText,
  richTextToHtml,
} from "@quenti/lib/editor";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { IconPlus } from "@tabler/icons-react";

import { resize } from "../common/cdn-loaders";
import { editorEventChannel } from "../events/editor";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import {
  AddImageButton,
  RemoveImageButton,
} from "../modules/editor/card/image-components";
import { RichTextBar } from "../modules/editor/card/rich-text-bar";
import { editorConfig } from "../modules/editor/editor-config";
import { PhotoView } from "./photo-view/photo-view";

export interface EditTermModalProps {
  term: FacingTerm | null;
  isOpen: boolean;
  onClose: () => void;
  onDefinition: boolean;
}

export const EditTermModal: React.FC<EditTermModalProps> = ({
  term,
  isOpen,
  onClose,
  onDefinition,
}) => {
  const utils = api.useUtils();
  const { entityType } = useSetFolderUnison();

  const [termAssetUrl, setTermAssetUrl] = React.useState<string | null>(null);
  const [cachedAssetUrl, setCachedAssetUrl] = React.useState<string | null>(
    null,
  );
  const [showExplanation, setShowExplanation] = React.useState(false);

  const wordEditor = useEditor({
    ...editorConfig(),
    content: term ? editorInput(term as EditorTerm, "word") : "",
  });
  const definitionEditor = useEditor({
    ...editorConfig(),
    content: term ? editorInput(term as EditorTerm, "definition") : "",
  });
  const explanationEditor = useEditor({
    ...editorConfig(),
    content: term ? editorInput(term as EditorTerm, "explanation") : "",
  });

  React.useEffect(() => {
    if (!term || !isOpen) return;

    wordEditor?.commands.setContent(editorInput(term as EditorTerm, "word"));
    definitionEditor?.commands.setContent(
      editorInput(term as EditorTerm, "definition"),
    );
    explanationEditor?.commands.setContent(
      editorInput(term as EditorTerm, "explanation"),
    );
    setShowExplanation(!!term.explanation?.trim());
    setTermAssetUrl(term.assetUrl);
    setCachedAssetUrl(term.assetUrl);

    if (onDefinition) {
      definitionEditor?.commands.focus();
    } else {
      wordEditor?.commands.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, isOpen]);

  React.useEffect(() => {
    const handle = (args: { id: string; url: string }) => {
      if (isOpen && args.id == term?.id) {
        setTermAssetUrl(args.url);
        setCachedAssetUrl(args.url);
      }
    };

    editorEventChannel.on("propagateImageUrl", handle);
    return () => {
      editorEventChannel.off("propagateImageUrl", handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const edit = api.terms.edit.useMutation({
    async onSuccess() {
      onClose();
      if (entityType == "set") {
        await utils.studySets.invalidate();
      } else {
        await utils.folders.invalidate();
      }
    },
  });

  const removeImage = api.terms.removeImage.useMutation();

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Edit term</Modal.Heading>
          <Stack w="full">
            <RichTextBar
              activeEditor={wordEditor}
              bg="gray.100"
              _dark={{
                bg: "gray.900",
              }}
            />
            <EditorContent
              editor={wordEditor}
              onKeyDown={(e) => {
                if ([" ", "ArrowRight", "ArrowLeft"].includes(e.key))
                  e.stopPropagation();
              }}
            />
          </Stack>
          <Stack w="full">
            <RichTextBar
              activeEditor={definitionEditor}
              bg="gray.100"
              _dark={{
                bg: "gray.900",
              }}
            />
            <EditorContent
              editor={definitionEditor}
              onKeyDown={(e) => {
                if ([" ", "ArrowRight", "ArrowLeft"].includes(e.key))
                  e.stopPropagation();
              }}
            />
          </Stack>
          {/* Explanation section */}
          {showExplanation ? (
            <Stack w="full">
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Explanation (additional context that appears during study)
              </Text>
              <RichTextBar
                activeEditor={explanationEditor}
                bg="gray.100"
                _dark={{
                  bg: "gray.900",
                }}
              />
              <EditorContent
                editor={explanationEditor}
                placeholder="Enter explanation..."
                onKeyDown={(e) => {
                  if ([" ", "ArrowRight", "ArrowLeft"].includes(e.key))
                    e.stopPropagation();
                }}
              />
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => {
                  setShowExplanation(false);
                  explanationEditor?.commands.clearContent();
                }}
                alignSelf="flex-start"
              >
                Remove explanation
              </Button>
            </Stack>
          ) : (
            <Box w="fit-content">
              <Tooltip
                label="Add additional context or explanation that will appear when students study this term"
                placement="top"
                hasArrow
              >
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<IconPlus size={16} />}
                  onClick={() => setShowExplanation(true)}
                  colorScheme="blue"
                  justifyContent="flex-start"
                >
                  Add explanation
                </Button>
              </Tooltip>
            </Box>
          )}
          {cachedAssetUrl ? (
            <Box w="100px" h="80px" mt={{ base: 3, md: 0 }} position="relative">
              <PhotoView src={resize({ src: cachedAssetUrl, width: 500 })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width={100}
                  height={80}
                  alt="Term asset"
                  src={resize({ src: cachedAssetUrl, width: 500 })}
                  style={{
                    cursor: "zoom-in",
                    width: 100,
                    height: 80,
                    objectFit: "cover",
                    aspectRatio: "5 / 4",
                    borderRadius: "6px",
                  }}
                />
              </PhotoView>
              <RemoveImageButton
                onClick={() => {
                  if (!term) return;
                  setCachedAssetUrl(null);
                }}
              />
            </Box>
          ) : (
            <AddImageButton
              w="100px"
              h="80px"
              onClick={() => {
                if (!term) return;
                editorEventChannel.emit("openSearchImages", {
                  termId: term.id,
                  studySetId: term.studySetId,
                });
              }}
            />
          )}
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!term) return;

                const wordJson = wordEditor!.getJSON();
                const definitionJson = definitionEditor!.getJSON();
                const explanationJson = explanationEditor!.getJSON();
                const word = getPlainText(wordJson);
                const definition = getPlainText(definitionJson);
                const explanation = getPlainText(explanationJson);

                const wordRichText = hasRichText(wordJson, word);
                const definitionRichText = hasRichText(
                  definitionJson,
                  definition,
                );
                const explanationRichText = hasRichText(
                  explanationJson,
                  explanation,
                );

                if (!cachedAssetUrl && termAssetUrl) {
                  await removeImage.mutateAsync({
                    id: term.id,
                    studySetId: term.studySetId,
                  });
                }

                edit.mutate({
                  id: term.id,
                  studySetId: term.studySetId,
                  word,
                  definition,
                  explanation: explanation || undefined,
                  wordRichText: wordRichText
                    ? richTextToHtml(wordJson)
                    : undefined,
                  definitionRichText: definitionRichText
                    ? richTextToHtml(definitionJson)
                    : undefined,
                  explanationRichText: explanationRichText
                    ? richTextToHtml(explanationJson)
                    : undefined,
                });
              }}
              isLoading={edit.isLoading || removeImage.isLoading}
            >
              Save
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
