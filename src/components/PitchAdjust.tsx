// PitchAdjust.tsx
import { useMainContext } from "@/context/useMainContext";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Plus, Minus } from "lucide-react";

const PitchAdjust = () => {
    const { pitch, setPitch, color, colorHover } = useMainContext();
    return (
        <Box>
            <Heading as="h3" size="2xl" userSelect="none" mb={2}>
                Chords Pitch
            </Heading>
            <Flex gap={4} align="center">
                <Box
                    cursor="pointer"
                    p="4"
                    border={`2px solid ${color}`}
                    _hover={{ bg: colorHover }}
                    onClick={() =>
                        setPitch((prev: number) => Math.max(0, prev - 1))
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
                    {pitch}
                </Heading>
                <Box
                    cursor="pointer"
                    p="4"
                    border={`2px solid ${color}`}
                    _hover={{ bg: colorHover }}
                    onClick={() =>
                        setPitch((prev: number) => Math.min(2, prev + 1))
                    }
                >
                    <Plus />
                </Box>
            </Flex>
        </Box>
    );
};

export default PitchAdjust;
