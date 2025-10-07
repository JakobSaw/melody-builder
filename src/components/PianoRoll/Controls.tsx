import { Button, Flex, Spinner } from "@chakra-ui/react";
import type { ControlsProps, NoteGrid } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useMainContext } from "@/context/useMainContext";
import RandomizerSelector from "./RandomizerSelector";

const scheduleAheadTime = 0.1;
const pianoGain = 1.5;

const Controls: React.FC<ControlsProps> = ({
    clearNotes,
    deleteMelody,
    grid,
    chordTimeline,
    numberOfNotesInMelody,
    isPlaying,
    setIsPlaying,
    randomizeNotes,
    randomizeChords,
    randomizeLevel,
    setRandomizeLevel,
}) => {
    const {
        pianoRoll,
        tempo,
        isMetronomeOn,
        audioCtxRef,
        pitch,
        chordBuffers,
        metronomeBuffer,
        noteBuffers,
        notesPerBar,
    } = useMainContext();
    const nextNoteTimeRef = useRef<number>(0); // Time for next note
    const schedulerIdRef = useRef<number | null>(null); // Animation frame ID
    const currentStepRef = useRef<number>(0); // For accurate tracking
    const chordTimelineRef = useRef<string[]>([]);
    const pitchRef = useRef<number>(1);
    const gridRef = useRef<NoteGrid>(grid);

    const randomizeButtons = ["notes", "chords"];

    const [deactivateRandomiozeButtons, setDeactivateRandomiozeButtons] =
        useState<string>("");

    const removeHighlightedClass = () => {
        const prevCells = document.querySelectorAll(
            ".piano-roll-cell.highlighted"
        );
        prevCells.forEach((el) => el.classList.remove("highlighted"));
    };
    const scheduleBufferAtTime = (
        buffer: AudioBuffer | undefined,
        time: number,
        gain: number
    ) => {
        if (!audioCtxRef.current || !buffer) return;
        const src = audioCtxRef.current.createBufferSource();
        src.buffer = buffer;
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.value = gain;
        src.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);
        src.start(time);
    };
    const scheduleChordAtTime = (step: number, time: number) => {
        if (!chordTimelineRef.current[step]) return;
        const timeLineChord = `${chordTimelineRef.current[step]}${pitchRef.current}`;
        if (!timeLineChord || !audioCtxRef.current) return;
        const buffer = chordBuffers[timeLineChord];
        scheduleBufferAtTime(buffer, time, pianoGain);
    };
    const advanceStep = () => {
        const secondsPerStep = 60 / tempo / 4;
        nextNoteTimeRef.current += secondsPerStep;
        currentStepRef.current =
            (currentStepRef.current + 1) % numberOfNotesInMelody;
    };
    const scheduler = () => {
        if (!audioCtxRef.current) return;

        while (
            nextNoteTimeRef.current <
            audioCtxRef.current.currentTime + scheduleAheadTime
        ) {
            removeHighlightedClass();
            const step = currentStepRef.current;
            const stepTime = nextNoteTimeRef.current;
            currentStepRef.current = step;

            // Add highlight to new current column
            const currentCells = document.querySelectorAll(`.step-${step}`);
            currentCells.forEach((el) => el.classList.add("highlighted"));

            if (step % 4 === 0 && isMetronomeOn && metronomeBuffer) {
                const isFullBeat = step % notesPerBar === 0;
                const gain = isFullBeat ? pianoGain : pianoGain / 2;
                scheduleBufferAtTime(metronomeBuffer, stepTime, gain);
            }

            for (let row = 0; row < pianoRoll.length; row++) {
                if (gridRef.current[row][step]) {
                    scheduleBufferAtTime(
                        noteBuffers[pianoRoll[row]],
                        stepTime,
                        pianoGain
                    );
                }
            }
            scheduleChordAtTime(step, stepTime);
            advanceStep();
        }

        schedulerIdRef.current = requestAnimationFrame(scheduler);
    };

    useEffect(() => {
        if (chordTimeline.some((c) => !!c)) {
            chordTimelineRef.current = chordTimeline;
        }
    }, [chordTimeline]);

    useEffect(() => {
        if (!gridRef.current) return;
        gridRef.current = grid;
    }, [grid]);

    useEffect(() => {
        if (pitch !== pitchRef.current) {
            pitchRef.current = pitch;
        }
    }, [pitch]);

    const startLoop = async () => {
        if (!audioCtxRef.current) return;
        await audioCtxRef.current.resume();

        nextNoteTimeRef.current = audioCtxRef.current.currentTime;
        currentStepRef.current = 0;

        scheduler();
        setTimeout(() => {
            setIsPlaying(true);
        }, 50);
    };
    const stopLoop = async () => {
        if (schedulerIdRef.current) {
            cancelAnimationFrame(schedulerIdRef.current);
            schedulerIdRef.current = null;
            removeHighlightedClass();
            setIsPlaying(false);
        }
    };

    const randomizerClicked = (notes: boolean) => {
        setTimeout(() => {
            if (notes) {
                randomizeNotes();
            } else {
                randomizeChords();
            }
        }, 1000);
        setDeactivateRandomiozeButtons(notes ? "notes" : "chords");
        setTimeout(() => {
            setDeactivateRandomiozeButtons("");
        }, 2000);
    };

    return (
        <Flex mt={10} gap={4} align={"center"}>
            <Button
                variant="solid"
                size="md"
                minWidth={"200px"}
                onClick={isPlaying ? stopLoop : startLoop}
            >
                {isPlaying ? "Stop" : "Start"}
            </Button>
            <Button size="md" variant="outline" onClick={clearNotes}>
                Clear Notes
            </Button>
            <Button
                size="md"
                variant="outline"
                onClick={deleteMelody}
                disabled={isPlaying}
            >
                Delete Melody
            </Button>
            {randomizeButtons.map((randomizeButton) => (
                <Button
                    key={randomizeButton}
                    minW={"210px"}
                    size="md"
                    variant="outline"
                    onClick={() =>
                        randomizerClicked(randomizeButton === "notes")
                    }
                    disabled={deactivateRandomiozeButtons === randomizeButton}
                >
                    {deactivateRandomiozeButtons === randomizeButton ? (
                        <Spinner size={"xs"} />
                    ) : randomizeButton === "notes" ? (
                        "🌈 Randomize Notes 🎶"
                    ) : (
                        "🌈 Randomize Chords 🎹"
                    )}
                </Button>
            ))}
            <RandomizerSelector
                randomizeLevel={randomizeLevel}
                setRandomizeLevel={setRandomizeLevel}
                deactivateRandomiozeButtons={deactivateRandomiozeButtons}
            />
        </Flex>
    );
};

export default Controls;
