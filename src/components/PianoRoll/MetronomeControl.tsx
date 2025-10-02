import { Button, Flex } from "@chakra-ui/react";
import { useMainContext } from "@/context/useMainContext";

const MetronomeControl = () => {
    const { isMetronomeOn, setIsMetronomeOn, isPlayingGlobal } =
        useMainContext();

    return (
        <Flex mt={10} gap={4}>
            <Button
                variant="outline"
                size="md"
                onClick={() => setIsMetronomeOn((prev) => !prev)}
                disabled={isPlayingGlobal}
            >
                Metronome: {isMetronomeOn ? "On" : "Off"}
            </Button>
        </Flex>
    );
};

export default MetronomeControl;
