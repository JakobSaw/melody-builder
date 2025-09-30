import { useMainContext } from "@/context/useMainContext";
import { NativeSelect, Flex, Heading, Box } from "@chakra-ui/react";

const KeySelector = () => {
    const { keyValue, setKeyValue, isPlayingGlobal, color, colorHover } =
        useMainContext();

    const tones = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ];

    return (
        <Box>
            <Heading as="h3" size="2xl" userSelect="none" mb={2}>
                Key
            </Heading>
            <Flex gap={4} align="center">
                <NativeSelect.Root disabled={isPlayingGlobal}>
                    <NativeSelect.Field
                        value={keyValue}
                        onChange={(e) => setKeyValue(e.target.value)}
                        fontSize="2xl"
                        maxW="200px"
                        w="full"
                        border={`2px solid ${color}`}
                        color={color}
                        bg="transparent"
                        _hover={{ bg: colorHover }}
                    >
                        {tones.map((tone) => (
                            <option
                                key={tone}
                                value={tone}
                                style={{ color: colorHover }}
                            >
                                {tone}
                            </option>
                        ))}
                    </NativeSelect.Field>
                </NativeSelect.Root>
            </Flex>
        </Box>
    );
};

export default KeySelector;
