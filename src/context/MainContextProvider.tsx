import { useEffect, useRef, useState, type ReactNode } from "react";
import MainContext from "./MainContext";
import { get } from "@tonaljs/scale";
import { simplify } from "@tonaljs/note";
import sharpNotes from "../notes/sharpNotes.json";
import type { Melody } from "@/types";
import { useColorModeValue } from "@/components/ui/color-mode";

const notesPerBar = 16;
const noteCellRatio = 1.25;
const marginLeft = 56;
const pianoRollLength = 5;
const pianoRollMaxWidth = window.innerWidth * 0.9;
const pianoRollMaxHeight = "60vh";
const hideScrollBar = {
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
        display: "none",
    },
};

export const MainProvider = ({ children }: { children: ReactNode }) => {
    const [tempo, setTempo] = useState<number>(120); // The Tempo of the Project
    const [pitch, setPitch] = useState<number>(1); // the Pitch of the Piano Roll
    const [keyValue, setKeyValue] = useState<string>("C"); // The Root Note / The Root Key
    const [mode, setMode] = useState<"Minor" | "Major">("Major"); // The Mode of the Project
    const [scaleChords, setScaleChords] = useState<string[]>([]); // The Chords of the selected Key
    const [scaleNotes, setScaleNotes] = useState<string[]>([
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
    ]);
    const [isMetronomeOn, setIsMetronomeOn] = useState<boolean>(false);
    const [pianoRoll, setPianoRoll] = useState<string[]>([]);
    const [soundsAreLoading, setSoundsAreLoading] = useState<boolean>(false);
    const [noteCellSize, setNoteCellSize] = useState<number>(30);
    const [melodies, setMelodies] = useState<Melody[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [isPlayingGlobal, setIsPlayingGlobal] = useState<boolean>(false);

    // const result = useColorModeValue("<light-mode-value>", "<dark-mode-value>")
    const color = useColorModeValue("#18181b", "white");
    const colorHover = useColorModeValue("#EEEEEE", "#333333");

    useEffect(() => {
        const scaleName = `${keyValue} ${mode}`;
        const scale = get(scaleName);
        const notes = scale.notes;
        const simplifiedNotes = notes.map((n) => simplify(n));
        const chords = simplifiedNotes.map((note, i) => {
            const chordType =
                mode === "Major"
                    ? ["", "-", "-", "", "", "-", "°"][i]
                    : ["-", "°", "", "-", "-", "", ""][i];
            return `${note}${chordType}`;
        });
        const getPianoRoll = [];
        for (let index = 0; index < pianoRollLength; index++) {
            for (
                let innerIndex = 0;
                innerIndex < simplifiedNotes.length;
                innerIndex++
            ) {
                let setPitch = `${index + 1}`;
                if (keyValue !== "C") {
                    let findRootIndex = 0;
                    if (simplifiedNotes.includes("C")) {
                        findRootIndex = simplifiedNotes.indexOf("C");
                    } else if (simplifiedNotes.includes("C#")) {
                        findRootIndex = simplifiedNotes.indexOf("C#");
                    }
                    if (innerIndex && innerIndex >= findRootIndex) {
                        setPitch = `${index + 2}`;
                    }
                }
                const getNote = simplifiedNotes[innerIndex].replace("#", "s");
                if (index + 2 < 6) {
                    getPianoRoll.push(`${getNote}${setPitch}`);
                }
            }
        }
        setPianoRoll(getPianoRoll.reverse());
        setScaleNotes(simplifiedNotes);
        setScaleChords(chords);
    }, [keyValue, mode]);

    // Buffers
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [noteBuffers, setNoteBuffers] = useState<Record<string, AudioBuffer>>(
        {}
    );
    const [metronomeBuffer, setMetronomeBuffer] = useState<AudioBuffer | null>(
        null
    );
    const [chordBuffers, setChordBuffers] = useState<
        Record<string, AudioBuffer>
    >({});

    // Scheduler Functions

    useEffect(() => {
        audioCtxRef.current = new AudioContext();

        const loadMetronome = async () => {
            const res = await fetch(`/samples/metronome.mp3`);
            const buf = await res.arrayBuffer();
            const decoded = await audioCtxRef.current!.decodeAudioData(buf);
            setMetronomeBuffer(decoded);
        };

        const loadPianoSample = async (note: string) => {
            const res = await fetch(`/samples/single/${note}.mp3`);
            const buf = await res.arrayBuffer();
            return audioCtxRef.current!.decodeAudioData(buf);
        };

        const loadChordSample = async (chordName: string) => {
            const res = await fetch(`/samples/chords/${chordName}.mp3`);
            const buf = await res.arrayBuffer();
            return audioCtxRef.current!.decodeAudioData(buf);
        };

        const loadAllSamples = async () => {
            setSoundsAreLoading(true);
            const getAllNotes = [];
            for (let index = 0; index < pianoRollLength; index++) {
                for (
                    let innerIndex = 0;
                    innerIndex < sharpNotes.length;
                    innerIndex++
                ) {
                    const getNote = sharpNotes[innerIndex];
                    getAllNotes.push(`${getNote}${index + 1}`);
                }
            }
            const getAllChords = [];
            for (let index = 0; index < 4; index++) {
                for (
                    let innerIndex = 0;
                    innerIndex < sharpNotes.length;
                    innerIndex++
                ) {
                    const getNote = sharpNotes[innerIndex].replace(
                        "s",
                        "sharp"
                    );
                    getAllChords.push(`${getNote}${index}`);
                    getAllChords.push(`${getNote}-${index}`);
                }
            }
            try {
                const result: Record<string, AudioBuffer> = {};
                for (const note of getAllNotes) {
                    result[note] = await loadPianoSample(note);
                }
                setNoteBuffers(result);
                const chordResult: Record<string, AudioBuffer> = {};
                for (const note of getAllChords) {
                    chordResult[note] = await loadChordSample(note);
                }
                setChordBuffers(chordResult);
                await loadMetronome();
            } catch (err) {
                console.error("error loading sample", err);
            } finally {
                setSoundsAreLoading(false);
            }
        };

        loadAllSamples();
    }, []);

    return (
        <MainContext.Provider
            value={{
                tempo,
                setTempo,
                pitch,
                setPitch,
                keyValue,
                setKeyValue,
                mode,
                setMode,
                scaleChords,
                scaleNotes,
                marginLeft,
                isMetronomeOn,
                setIsMetronomeOn,
                pianoRoll,
                soundsAreLoading,
                pianoRollMaxWidth,
                pianoRollMaxHeight,
                metronomeBuffer,
                noteBuffers,
                chordBuffers,
                audioCtxRef,
                hideScrollBar,
                noteCellRatio,
                notesPerBar,
                noteCellSize,
                setNoteCellSize,
                melodies,
                setMelodies,
                uploading,
                setUploading,
                isPlayingGlobal,
                setIsPlayingGlobal,
                color,
                colorHover,
            }}
        >
            {children}
        </MainContext.Provider>
    );
};
