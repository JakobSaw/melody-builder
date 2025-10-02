import { Box } from "@chakra-ui/react";
import { useMainContext } from "@/context/useMainContext";
import Controls from "./Controls";
import { useRef, useEffect, useState, type FC } from "react";
import BarCounter from "./BarCounter";
import type { Melody, NoteGrid, PianoRollProps } from "@/types";
import ChordTimeline from "../Chords/ChordTimeline";
import InnerPianoRoll from "./InnerPianoRoll";

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

    const numberOfNotesInMelody = notesPerBar * numberOfBarsInMelody;

    const mainRef = useRef<HTMLDivElement>(null);
    const verticalRef = useRef<HTMLDivElement>(null);
    const horizontalRef = useRef<HTMLDivElement>(null);

    const clearGrid = () => {
        const emptyGrid: NoteGrid = Array.from(
            { length: pianoRoll.length },
            () => Array(numberOfNotesInMelody).fill(false)
        );
        setGrid(emptyGrid);
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
                clearGrid={clearGrid}
                deleteMelody={deleteMelody}
                grid={grid}
                chordTimeline={chordTimeline}
                numberOfNotesInMelody={numberOfNotesInMelody}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />
        </Box>
    );
};

export default PianoRoll;
