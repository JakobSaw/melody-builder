import { useMainContext } from "@/context/useMainContext";
import { NativeSelect, Flex, Heading, Box } from "@chakra-ui/react";

const ModeSelector = () => {
    const { mode, setMode, isPlayingGlobal, color, colorHover } =
        useMainContext();
    const modes = ["Minor", "Major"];

    return (
        <Box>
            <Heading as="h3" size="2xl" userSelect="none" mb={2}>
                Mode
            </Heading>
            <Flex gap={4} align="center">
                <NativeSelect.Root disabled={isPlayingGlobal}>
                    <NativeSelect.Field
                        value={mode}
                        onChange={(e) => {
                            if (
                                e.target.value === "Minor" ||
                                e.target.value === "Major"
                            ) {
                                setMode(e.target.value);
                            }
                        }}
                        fontSize="2xl"
                        maxW="200px"
                        w="full"
                        border={`2px solid ${color}`}
                        color={color}
                        bg="transparent"
                        _hover={{ bg: colorHover }}
                    >
                        {modes.map((mode) => (
                            <option
                                key={mode}
                                value={mode}
                                style={{ color: "black" }}
                            >
                                {mode}
                            </option>
                        ))}
                    </NativeSelect.Field>
                </NativeSelect.Root>
            </Flex>
        </Box>
    );
};

export default ModeSelector;
