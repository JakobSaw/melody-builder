import { Box } from "@chakra-ui/react";
import { useMainContext } from "@/context/useMainContext";
import Controls from "./Controls";
import { useRef, useEffect, useState, type FC } from "react";
import BarCounter from "./BarCounter";
import type { Melody, NoteGrid, PianoRollProps } from "@/types";
import ChordTimeline from "../Chords/ChordTimeline";
import InnerPianoRoll from "./InnerPianoRoll";
import { getRandomBetween, isEven } from "@/utils";

type PartialMelody = Partial<Melody>;

const PianoRoll: FC<PianoRollProps> = ({ melody, deleteMelody }) => {
    const {
        pianoRoll,
        scaleNotes,
        notesPerBar,
        melodies,
        setMelodies,
        uploading,
        setIsPlayingGlobal,
        scaleChords,
    } = useMainContext();
    const [grid, setGrid] = useState<NoteGrid>(melody.grid);
    const [chordTimeline, setChordTimeline] = useState<string[]>(
        melody.chordTimeline
    );
    const [numberOfBarsInMelody, setNumberOfBarsInMelody] = useState<number>(
        melody.numberOfBarsInMelody
    );
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isScrolling, setIsScrolling] = useState<boolean>(false);
    const [randomizeLevel, setRandomizeLevel] = useState<number>(1);

    const numberOfNotesInMelody = notesPerBar * numberOfBarsInMelody;

    const mainRef = useRef<HTMLDivElement>(null);
    const verticalRef = useRef<HTMLDivElement>(null);
    const horizontalRef = useRef<HTMLDivElement>(null);

    const emptyGrid: NoteGrid = Array.from({ length: pianoRoll.length }, () =>
        Array(numberOfNotesInMelody).fill(false)
    );
    const emptyChordTimeLine = Array(numberOfNotesInMelody).fill("");

    const clearNotes = () => {
        setGrid(emptyGrid);
    };

    const clearGrid = () => {
        clearNotes();
        const emptyChordTimeLine = Array(numberOfNotesInMelody).fill("");
        setChordTimeline(emptyChordTimeLine);
    };

    const syncScroll = () => {
        if (!mainRef.current || !verticalRef.current || !horizontalRef.current)
            return;
        const scrollTop = mainRef.current.scrollTop;
        verticalRef.current.scrollTop = scrollTop;
        horizontalRef.current.scrollLeft = mainRef.current.scrollLeft;
    };
    const syncHorizontalScroll = () => {
        if (!mainRef.current || !horizontalRef.current) return;
        mainRef.current.scrollLeft = horizontalRef.current.scrollLeft;
    };

    let timeoutId: ReturnType<typeof setTimeout>;

    const syncVerticalScroll = () => {
        if (!mainRef.current || !verticalRef.current) return;
        mainRef.current.scrollTop = verticalRef.current.scrollTop;
        if (!isPlaying) {
            setIsScrolling(true);

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        }
    };

    const updateMelody = (updates: PartialMelody) => {
        if (uploading) return;
        const findIndex = melodies.findIndex((m) => m.id === melody.id);
        if (findIndex === -1) return;

        const updatedMelody = {
            ...melodies[findIndex],
            ...updates,
        };

        const updatedMelodies = [...melodies];
        updatedMelodies[findIndex] = updatedMelody;

        setMelodies(updatedMelodies);
    };

    const randomizeNotes = () => {
        const newGrid = [...emptyGrid];
        const randomizeFactor = {
            numberOfNotes: [0.4, 0.6, 0.8],
            notesToPutNotesOnto: [
                [7, 13],
                [7, 20],
                [3, 24],
            ],
        };
        const index = randomizeLevel - 1;

        const numberOfNotesToPutIntoTheGrid = Math.round(
            numberOfNotesInMelody * randomizeFactor.numberOfNotes[index]
        );

        const getChanceOfEvery16thNote =
            numberOfNotesToPutIntoTheGrid / numberOfNotesInMelody;

        for (
            let indexGrid = 0;
            indexGrid < numberOfNotesInMelody;
            indexGrid++
        ) {
            const shouldPlaceNote = Math.random() < getChanceOfEvery16thNote;
            if (shouldPlaceNote) {
                const chooseNote = getRandomBetween(
                    randomizeFactor.notesToPutNotesOnto[index][0],
                    randomizeFactor.notesToPutNotesOnto[index][1]
                );
                newGrid[chooseNote][indexGrid] = true;
            }
        }
        setGrid(newGrid);
    };
    const randomizeChords = () => {
        const newRandomizedChordTimeline = [...emptyChordTimeLine];
        const randomizeFactor = {
            numberOfChords: [0.7, 0.85, 1],
        };
        const index = randomizeLevel - 1;
        const numberOfChordsToPutIntoTheGrid = Math.round(
            numberOfNotesInMelody * randomizeFactor.numberOfChords[index]
        );
        const getChanceOfEvery16thNote =
            numberOfChordsToPutIntoTheGrid / numberOfNotesInMelody;

        for (
            let indexGrid = 0;
            indexGrid < numberOfNotesInMelody;
            indexGrid++
        ) {
            const shouldPlaceNote = Math.random() < getChanceOfEvery16thNote;
            if (shouldPlaceNote && isEven(indexGrid)) {
                const chooseChord =
                    scaleChords[getRandomBetween(0, scaleChords.length - 1)];
                const dim = chooseChord.includes("°");
                if (!dim) {
                    newRandomizedChordTimeline[indexGrid] = chooseChord;
                }
            }
        }
        setChordTimeline(newRandomizedChordTimeline);
    };

    useEffect(() => {
        updateMelody({ numberOfBarsInMelody });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfBarsInMelody]);

    useEffect(() => {
        if (!isPlaying) {
            updateMelody({ grid });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grid]);

    useEffect(() => {
        if (!isPlaying) {
            updateMelody({ chordTimeline });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chordTimeline]);

    useEffect(() => {
        if (!isPlaying) {
            updateMelody({ grid, chordTimeline });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    useEffect(() => {
        const main = mainRef.current;
        const horizontal = horizontalRef.current;
        const vertical = verticalRef.current;
        if (!main || !horizontal || !vertical) return;

        horizontal.addEventListener("scroll", syncHorizontalScroll);
        vertical.addEventListener("scroll", syncVerticalScroll);
        main.addEventListener("scroll", syncScroll);
        return () => {
            horizontal.removeEventListener("scroll", syncHorizontalScroll);
            vertical.removeEventListener("scroll", syncVerticalScroll);
            main.removeEventListener("scroll", syncScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (uploading) return;
        clearGrid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scaleNotes]);

    useEffect(() => {
        if (uploading) return;
        const chordTimelineLength = chordTimeline.length / notesPerBar;
        if (numberOfBarsInMelody < chordTimelineLength) {
            const newChordTimeline = chordTimeline.slice(
                0,
                numberOfBarsInMelody * notesPerBar
            );
            setChordTimeline(newChordTimeline);
        } else if (numberOfBarsInMelody > chordTimelineLength) {
            const newChords = Array(
                (numberOfBarsInMelody - chordTimelineLength) * notesPerBar
            ).fill("");
            const newChordTimeline = [...chordTimeline, ...newChords];
            setChordTimeline(newChordTimeline);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfBarsInMelody]);

    useEffect(() => {
        setTimeout(() => setIsPlayingGlobal(isPlaying), 50);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    return (
        <Box mt="10">
            <BarCounter
                bars={numberOfBarsInMelody}
                setBars={setNumberOfBarsInMelody}
                isPlaying={isPlaying}
            />
            <InnerPianoRoll
                numberOfNotesInMelody={numberOfNotesInMelody}
                mainRef={mainRef}
                verticalRef={verticalRef}
                grid={grid}
                setGrid={setGrid}
                isPlaying={isPlaying}
                isScrolling={isScrolling}
            />
            <ChordTimeline
                chordTimeline={chordTimeline}
                setChordTimeline={setChordTimeline}
                horizontalRef={horizontalRef}
                numberOfNotesInMelody={numberOfNotesInMelody}
            />
            <Controls
                clearNotes={clearNotes}
                deleteMelody={deleteMelody}
                grid={grid}
                chordTimeline={chordTimeline}
                numberOfNotesInMelody={numberOfNotesInMelody}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                randomizeNotes={randomizeNotes}
                randomizeChords={randomizeChords}
                randomizeLevel={randomizeLevel}
                setRandomizeLevel={setRandomizeLevel}
            />
        </Box>
    );
};

export default PianoRoll;
