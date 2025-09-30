// BarCounter.tsx
import type { BarCounterProps } from "@/types";
import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { Plus, Minus } from "lucide-react";
import { useMainContext } from "@/context/useMainContext";

const BarCounter: React.FC<BarCounterProps> = ({
    bars,
    setBars,
    isPlaying,
}) => {
    const {
        soundsAreLoading,
        pianoRollMaxWidth,
        uploading,
        color,
        colorHover,
    } = useMainContext();
    return (
        <Box mb="10">
            <Heading as="h3" size="2xl" userSelect="none" mb={2}>
                Number of Bars in Melody
            </Heading>
            <Flex
                justifyContent="space-between"
                alignItems={"center"}
                maxW={`${pianoRollMaxWidth}px`}
            >
                <Flex gap={4} align="center">
                    <Box
                        cursor={isPlaying ? "disabled" : "pointer"}
                        p="4"
                        border={`2px solid ${color}`}
                        _hover={{ bg: colorHover }}
                        onClick={
                            isPlaying
                                ? undefined
                                : () =>
                                      setBars((prev: number) =>
                                          prev === 2 ? 1 : Math.max(2, prev - 2)
                                      )
                        }
                    >
                        <Minus />
                    </Box>
                    <Heading
                        as="h3"
                        size="2xl"
                        userSelect="none"
                        width="40px"
                        textAlign="center"
                    >
                        {bars}
                    </Heading>
                    <Box
                        cursor={isPlaying ? "disabled" : "pointer"}
                        p="4"
                        border={`2px solid ${color}`}
                        _hover={{ bg: colorHover }}
                        onClick={
                            isPlaying
                                ? undefined
                                : () =>
                                      setBars((prev: number) =>
                                          prev === 1
                                              ? 2
                                              : Math.min(16, prev + 2)
                                      )
                        }
                    >
                        <Plus />
                    </Box>
                </Flex>
                {soundsAreLoading || uploading ? (
                    <Flex gap={2} justifyContent={"center"}>
                        <Spinner />
                        <Text fontSize={"18px"}>
                            {soundsAreLoading ? "Samples" : "Melodies"} are
                            loading
                        </Text>
                    </Flex>
                ) : (
                    <Box />
                )}
            </Flex>
        </Box>
    );
};

export default BarCounter;
