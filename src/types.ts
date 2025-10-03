import type { SystemStyleObject } from "@chakra-ui/react";
import type { Dispatch, RefObject, SetStateAction } from "react";

type NoteGrid = boolean[][];
type ChordTypes = "Triad" | "7th";

type Melody = {
    id: string;
    grid: NoteGrid;
    chordTimeline: string[];
    numberOfBarsInMelody: number;
};

interface MainContextProps {
    tempo: number;
    setTempo: Dispatch<SetStateAction<number>>;
    pitch: number;
    setPitch: Dispatch<SetStateAction<number>>;
    keyValue: string;
    setKeyValue: (key: string) => void;
    mode: "Major" | "Minor";
    setMode: (mode: "Major" | "Minor") => void;
    scaleChords: string[];
    scaleNotes: string[];
    marginLeft: number;
    isMetronomeOn: boolean;
    setIsMetronomeOn: Dispatch<SetStateAction<boolean>>;
    pianoRoll: string[];
    soundsAreLoading: boolean;
    pianoRollMaxWidth: number;
    pianoRollMaxHeight: string;
    metronomeBuffer: AudioBuffer | null;
    noteBuffers: Record<string, AudioBuffer>;
    chordBuffers: Record<string, AudioBuffer>;
    audioCtxRef: React.RefObject<AudioContext | null>;
    hideScrollBar: SystemStyleObject;
    noteCellRatio: number;
    notesPerBar: number;
    noteCellSize: number;
    setNoteCellSize: Dispatch<SetStateAction<number>>;
    melodies: Melody[];
    setMelodies: (melodies: Melody[]) => void;
    uploading: boolean;
    setUploading: (uploading: boolean) => void;
    isPlayingGlobal: boolean;
    setIsPlayingGlobal: (isPlayingGlobal: boolean) => void;
    color: string;
    colorHover: string;
    chordType: ChordTypes;
    setChordType: (chordType: ChordTypes) => void;
}

interface ChordTimelineProps {
    chordTimeline: string[];
    horizontalRef: RefObject<HTMLDivElement | null>;
    numberOfNotesInMelody: number;
    setChordTimeline: (chordTimeline: string[]) => void;
}

interface ChordButtonProps {
    chord: string;
    index: number;
}

interface SingleChordProps {
    step: number;
    chordTimeline: string[];
    setChordTimeline: (chordTimeline: string[]) => void;
}

interface PianoRollProps {
    deleteMelody: () => void;
    melody: Melody;
}

interface InnerPianoRollProps {
    numberOfNotesInMelody: number;
    mainRef: RefObject<HTMLDivElement | null>;
    verticalRef: RefObject<HTMLDivElement | null>;
    grid: NoteGrid;
    setGrid: (grid: NoteGrid) => void;
    isPlaying: boolean;
    isScrolling: boolean;
}

interface PianoRollCellProps {
    cellIndex: number;
    grid: NoteGrid;
    setGrid: (grid: NoteGrid) => void;
    numberOfNotesInMelody: number;
    isPlaying: boolean;
}

interface ControlsProps {
    clearNotes: () => void;
    deleteMelody: () => void;
    grid: NoteGrid;
    chordTimeline: string[];
    numberOfNotesInMelody: number;
    isPlaying: boolean;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

interface BarCounterProps {
    bars: number;
    setBars: Dispatch<SetStateAction<number>>;
    isPlaying: boolean;
}

export type {
    SingleChordProps,
    ChordButtonProps,
    MainContextProps,
    PianoRollProps,
    PianoRollCellProps,
    NoteGrid,
    BarCounterProps,
    ControlsProps,
    ChordTimelineProps,
    InnerPianoRollProps,
    Melody,
    ChordTypes,
};
