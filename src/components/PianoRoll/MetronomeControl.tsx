import { Box, Button, Heading } from "@chakra-ui/react";
import { useMainContext } from "@/context/useMainContext";

const MetronomeControl = () => {
    const { isMetronomeOn, setIsMetronomeOn, isPlayingGlobal } =
        useMainContext();

    return (
        <Box mt={10}>
            <Heading as="h3" size="xl" userSelect="none" mb={2}>
                Metronome Toggle
            </Heading>
            <Button
                variant="outline"
                size="md"
                onClick={() => setIsMetronomeOn((prev) => !prev)}
                disabled={isPlayingGlobal}
            >
                Metronome: {isMetronomeOn ? "On" : "Off"}
            </Button>
        </Box>
    );
};

export default MetronomeControl;
