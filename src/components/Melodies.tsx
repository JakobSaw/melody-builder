import { Box, Button, Heading } from "@chakra-ui/react";
import PianoRoll from "./PianoRoll/PianoRoll";
import { useMainContext } from "@/context/useMainContext";
import type { NoteGrid } from "@/types";

const startNumberOfBarsInMelody = 2;

const Melodies = () => {
    const { melodies, setMelodies, pianoRoll, notesPerBar } = useMainContext();

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
            <Heading
                as="h3"
                size="2xl"
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
                size="2xl"
            >
                Add Melody
            </Button>
            {melodies.length > 0 && (
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
