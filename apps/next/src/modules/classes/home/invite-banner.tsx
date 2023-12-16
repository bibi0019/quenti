import React from "react";

import { env } from "@quenti/env/client";
import { api } from "@quenti/trpc";

import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconCopy } from "@tabler/icons-react";

import { GhostGroup } from "../../../components/ghost-group";
import { useClass } from "../../../hooks/use-class";
import { useImageQrCode } from "../../../hooks/use-image-qrcode";
import { SectionSelect } from "../section-select";

export const InviteBanner = () => {
  const { data: class_ } = useClass();
  const utils = api.useUtils();

  const [selectedSection, setSection] = React.useState<string>(
    class_!.sections![0]!.id,
  );

  const [code, setCode] = React.useState<string | null>(
    class_!.sections![0]!.joinCode?.code ?? null,
  );
  const { QR } = useImageQrCode();

  React.useEffect(() => {
    const section = class_!.sections!.find((s) => s.id === selectedSection);
    if (!section) return;

    const code = section.joinCode?.code;
    setCode(code ?? null);
    if (!code) {
      createJoinCode.mutate({ classId: class_!.id, sectionId: section.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  const createJoinCode = api.classes.createJoinCode.useMutation({
    onSuccess: async (data) => {
      await utils.classes.get.invalidate();
      setCode(data.code);
    },
  });

  return (
    <Box
      w="full"
      rounded="xl"
      p="8"
      borderWidth="2px"
      borderColor="gray.200"
      bg="white"
      shadow="lg"
      _dark={{ borderColor: "gray.750", bg: "gray.800" }}
    >
      <Flex
        justifyContent={{ base: "start", lg: "space-between" }}
        gap="4"
        flexDir={{
          base: "column",
          md: "row",
        }}
      >
        <Stack spacing="8">
          <HStack spacing="6" flexDir={{ base: "column", lg: "row" }}>
            <Box w="max-content">
              <GhostGroup />
            </Box>
            <Stack spacing="1">
              <Heading
                fontSize="lg"
                fontWeight={600}
                color="gray.800"
                _dark={{
                  color: "gray.200",
                }}
              >
                It&apos;s looking a little lonely in here...
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Invite your students to join this class to get started.
              </Text>
              <HStack
                maxW="375px"
                spacing="3"
                mt="4"
                flexDir={{
                  base: "column",
                  sm: "row",
                }}
                alignItems={{
                  base: "start",
                  sm: "center",
                }}
              >
                <Box color="inherit" w="160px" minW="160px">
                  <SectionSelect
                    size="sm"
                    sections={class_?.sections || []}
                    onChange={(s) => {
                      setSection(s);
                    }}
                    value={selectedSection}
                  />
                </Box>
                <Skeleton rounded="md" isLoaded={!!code}>
                  <InputGroup>
                    <Input size="sm" value={`quenti.io/j${code}`} />
                    <InputRightElement boxSize="32px">
                      <IconButton
                        rounded="md"
                        colorScheme="gray"
                        aria-label="Search database"
                        variant="ghost"
                        icon={<IconCopy size={16} />}
                        size="xs"
                      />
                    </InputRightElement>
                  </InputGroup>
                </Skeleton>
              </HStack>
            </Stack>
          </HStack>
        </Stack>
        <Center
          flex={{ base: "inherit", sm: 1, lg: "inherit" }}
          mt={{ base: 4, md: 0 }}
        >
          <Box maxW="375px" w={{ base: "full", md: "auto" }}>
            <Box overflow="hidden" rounded="md" shadow="xl" w="max">
              {!!code ? (
                <QR
                  text={`${env.NEXT_PUBLIC_WEBSITE_URL}/j${code}`}
                  options={{ width: 112, margin: 2 }}
                />
              ) : (
                <Center w={112} h={112}>
                  <Spinner size="sm" color="blue.200" />
                </Center>
              )}
            </Box>
          </Box>
        </Center>
      </Flex>
    </Box>
  );
};
