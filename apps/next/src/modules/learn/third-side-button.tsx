import React from "react";

import { Display } from "@quenti/components/display";
import type { FacingTerm } from "@quenti/interfaces";

import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";

import { IconInfoCircle } from "@tabler/icons-react";

interface ThirdSideButtonProps {
  term: FacingTerm;
}

export const ThirdSideButton: React.FC<ThirdSideButtonProps> = ({ term }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!term.explanation && !term.explanationRichText) {
    return null;
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          icon={<IconInfoCircle size={16} />}
          aria-label="Show explanation"
          size="sm"
          variant="ghost"
          colorScheme="gray"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Explanation</PopoverHeader>
        <PopoverBody>
          <Display
            text={term.explanation || ""}
            richText={term.explanationRichText}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
