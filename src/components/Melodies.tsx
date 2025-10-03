import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import PianoRoll from "./PianoRoll/PianoRoll";
import { useMainContext } from "@/context/useMainContext";
import type { NoteGrid } from "@/types";

const startNumberOfBarsInMelody = 2;

const Melodies = () => {
    const {
        melodies,
        setMelodies,
        pianoRoll,
        notesPerBar,
        pianoRollMaxWidth,
        soundsAreLoading,
        uploading,
    } = useMainContext();

    const startNumberOfNotesInMelody = startNumberOfBarsInMelody * notesPerBar;

    const emptyGrid: NoteGrid = Array.from({ length: pianoRoll.length }, () =>
        Array(startNumberOfBarsInMelody).fill(false)
    );
    const addMelody = () => {
        const newMelody = {
            id: Date.now().toString(),
            grid: emptyGrid,
            chordTimeline: Array(startNumberOfNotesInMelody).fill(""),
            numberOfBarsInMelody: startNumberOfBarsInMelody,
        };
        setMelodies([...melodies, newMelody]);
    };
    const deleteMelody = (melodyId: string) => {
        const newMelodies = melodies.filter((melody) => melody.id !== melodyId);
        setMelodies(newMelodies);
    };
    return (
        <Box mt="10">
            <Flex
                justify={"space-between"}
                alignItems={"center"}
                maxW={`${pianoRollMaxWidth}px`}
            >
                <Box>
                    <Heading
                        as="h3"
                        size="xl"
                        userSelect="none"
                        textDecor="underline"
                        mb={4}
                    >
                        Melodies
                    </Heading>
                    <Button
                        colorScheme="teal"
                        variant="solid"
                        onClick={addMelody}
                        size="md"
                        disabled={soundsAreLoading}
                    >
                        Add Melody
                    </Button>
                </Box>
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
            {melodies.length > 0 && !soundsAreLoading && (
                <>
                    {melodies.map((melody) => (
                        <PianoRoll
                            key={melody.id}
                            melody={melody}
                            deleteMelody={() => deleteMelody(melody.id)}
                        />
                    ))}
                </>
            )}
        </Box>
    );
};

export default Melodies;
