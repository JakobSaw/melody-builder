import { useMainContext } from "@/context/useMainContext";
import type { ChordTypes } from "@/types";
import { NativeSelect, Flex, Heading, Box } from "@chakra-ui/react";

const ChordTypeSelector = () => {
    const { chordType, setChordType, isPlayingGlobal, color, colorHover } =
        useMainContext();
    const chordTypes = ["Triad", "7th"];

    return (
        <Box>
            <Heading as="h3" size="xl" userSelect="none" mb={2}>
                Chord Type
            </Heading>
            <Flex gap={4} align="center">
                <NativeSelect.Root disabled={isPlayingGlobal}>
                    <NativeSelect.Field
                        value={chordType}
                        onChange={(e) => {
                            const value = e.target.value as ChordTypes;
                            if (chordTypes.includes(value)) {
                                setChordType(value);
                            }
                        }}
                        fontSize="xl"
                        maxW="200px"
                        w="full"
                        border={`2px solid ${color}`}
                        color={color}
                        bg="transparent"
                        _hover={{ bg: colorHover }}
                    >
                        {chordTypes.map((chordType) => (
                            <option
                                key={chordType}
                                value={chordType}
                                style={{ color: "black" }}
                            >
                                {chordType}
                            </option>
                        ))}
                    </NativeSelect.Field>
                </NativeSelect.Root>
            </Flex>
        </Box>
    );
};

export default ChordTypeSelector;
