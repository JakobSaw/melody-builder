import { useMainContext } from "@/context/useMainContext";
import type { PianoRollCellProps } from "@/types";
import { Box } from "@chakra-ui/react";
import { memo, type FC } from "react";
import { useColorMode } from "../ui/color-mode";

const PianoRollCell: FC<PianoRollCellProps> = memo(
    ({ cellIndex, numberOfNotesInMelody, grid, setGrid, isPlaying }) => {
        const { pianoRoll, notesPerBar, scaleNotes, audioCtxRef, noteBuffers } =
            useMainContext();

        const { colorMode } = useColorMode();

        const colors = {
            dark: colorMode === "light" ? "#BBBBBB" : "#999999",
            mid: colorMode === "light" ? "#CCCCCC" : "#777777",
            lighter: colorMode === "light" ? "#DDDDDD" : "#555555",
            light: colorMode === "light" ? "#EEEEEE" : "#333333",
        };

        function removeNumbers(input: string): string {
            return input.replace(/\d+/g, "");
        }

        const noteIndex = Math.floor(cellIndex / numberOfNotesInMelody);
        const pianoRollNote = pianoRoll[noteIndex].replace("s", "#");
        const stepIndex = cellIndex % numberOfNotesInMelody;
        const active = grid[noteIndex]?.[stepIndex];
        const scaleNoteIndex = scaleNotes.indexOf(removeNumbers(pianoRollNote));

        const toggleCell = () => {
            const newGrid = [...grid];
            newGrid[noteIndex][stepIndex] = !newGrid[noteIndex][stepIndex];
            setTimeout(() => setGrid(newGrid), 50);
            if (newGrid[noteIndex][stepIndex] && !isPlaying) {
                if (!audioCtxRef.current || !noteBuffers[pianoRoll[noteIndex]])
                    return;

                const source = audioCtxRef.current.createBufferSource();
                source.buffer = noteBuffers[pianoRoll[noteIndex]];

                const gainNode = audioCtxRef.current.createGain();
                gainNode.gain.value = 1.5;

                source
                    .connect(gainNode)
                    .connect(audioCtxRef.current.destination);
                source.start();
            }
        };

        const getNoteBackground = () => {
            if (!scaleNoteIndex) return "tonic";
            if (scaleNoteIndex === 2 || scaleNoteIndex === 5) return "low";
            if (scaleNoteIndex === 1 || scaleNoteIndex === 3) return "mid";
            if (scaleNoteIndex === 4 || scaleNoteIndex === 6) return "high";
            return "lightcoral";
        };

        const getBackground = (hover: boolean) => {
            if (active || hover) {
                return getNoteBackground();
            }

            const stepInBar = stepIndex % notesPerBar;

            if (stepInBar === 0) {
                return hover ? colors.dark : colors.mid;
            }

            if (stepInBar % 4 === 0) {
                return hover ? colors.mid : colors.lighter;
            }

            return hover ? colors.lighter : colors.light;
        };

        return (
            <Box
                className={`piano-roll-cell step-${stepIndex}`}
                bg={getBackground(false)}
                onClick={toggleCell}
                cursor="pointer"
                _hover={
                    active
                        ? { border: "2px solid white" }
                        : { bg: getBackground(true) }
                }
            />
        );
    }
);
export default PianoRollCell;
