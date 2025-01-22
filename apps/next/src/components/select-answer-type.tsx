import {
  Box,
  Button,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconFileText, IconListNumbers } from "@tabler/icons-react";

export interface SelectAnswerTypeProps {
  value: "MultipleChoice" | "Written";
  onChange: (type: "MultipleChoice" | "Written") => void;
}

const getAnswerTypeIcon = (type: "MultipleChoice" | "Written") => {
  switch (type) {
    case "MultipleChoice":
      return IconListNumbers;
    case "Written":
      return IconFileText;
  }
};

const getAnswerTypeName = (type: "MultipleChoice" | "Written") => {
  switch (type) {
    case "MultipleChoice":
      return "Multiple Choice";
    case "Written":
      return "Written";
  }
};

export const SelectAnswerType: React.FC<SelectAnswerTypeProps> = ({
  value,
  onChange,
}) => {
  const selectedBorder = useColorModeValue("blue.600", "blue.200");
  const defaultBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <HStack spacing={3}>
      {["MultipleChoice", "Written"].map((type) => {
        const Icon = getAnswerTypeIcon(type as "MultipleChoice" | "Written");
        const checked = value === type;

        return (
          <Button
            key={type}
            w="full"
            variant="outline"
            rounded="xl"
            bg="transparent"
            borderWidth="2px"
            borderColor={checked ? selectedBorder : defaultBorder}
            py="6"
            px="4"
            colorScheme="gray"
            onClick={() => onChange(type as "MultipleChoice" | "Written")}
          >
            <HStack w="full">
              <Box
                transition="color 0.15s ease-in-out"
                color={checked ? selectedBorder : "gray.400"}
                _dark={{
                  color: checked ? selectedBorder : "gray.500",
                }}
              >
                <Icon size={20} />
              </Box>
              <Text fontWeight={600}>
                {getAnswerTypeName(type as "MultipleChoice" | "Written")}
              </Text>
            </HStack>
          </Button>
        );
      })}
    </HStack>
  );
};