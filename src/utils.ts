import type { ChordTypes } from "./types";

const getNote = (
    mode: "Minor" | "Major",
    chordType: ChordTypes,
    index: number
) => {
    if (mode === "Minor") {
        if (chordType === "7th") {
            if (index === 0)
                return {
                    note: "I",
                    color: "tonic",
                    chord: "-7",
                };
            if (index === 1)
                return {
                    note: "ii",
                    color: "mid",
                    chord: "-7b5",
                };
            if (index === 2)
                return {
                    note: "iii",
                    color: "low",
                    chord: "maj7",
                };
            if (index === 3)
                return {
                    note: "IV",
                    color: "high",
                    chord: "-7",
                };
            if (index === 4)
                return {
                    note: "V",
                    color: "low",
                    chord: "-7",
                };
            if (index === 5)
                return {
                    note: "vi",
                    color: "mid",
                    chord: "maj7",
                };
            if (index === 6)
                return {
                    note: "vii°",
                    color: "high",
                    chord: "7",
                };
        }
        if (index === 0)
            return {
                note: "i",
                color: "tonic",
                chord: "-",
            };
        if (index === 1)
            return {
                note: "ii°",
                color: "mid",
                chord: "°",
            };
        if (index === 2)
            return {
                note: "III",
                color: "low",
                chord: "",
            };
        if (index === 3)
            return {
                note: "iv",
                color: "mid",
                chord: "-",
            };
        if (index === 4)
            return {
                note: "v",
                color: "high",
                chord: "-",
            };
        if (index === 5)
            return {
                note: "VI",
                color: "low",
                chord: "",
            };
        if (index === 6)
            return {
                note: "VII",
                color: "high",
                chord: "",
            };
    }
    if (chordType === "7th") {
        if (index === 0)
            return {
                note: "i",
                color: "tonic",
                chord: "maj7",
            };
        if (index === 1)
            return {
                note: "ii°",
                color: "mid",
                chord: "-7",
            };
        if (index === 2)
            return {
                note: "III",
                color: "low",
                chord: "-7",
            };
        if (index === 3)
            return {
                note: "iv",
                color: "mid",
                chord: "maj7",
            };
        if (index === 4)
            return {
                note: "v",
                color: "high",
                chord: "7",
            };
        if (index === 5)
            return {
                note: "VI",
                color: "low",
                chord: "-7",
            };
        if (index === 6)
            return {
                note: "VII",
                color: "high",
                chord: "-7b5",
            };
    }
    if (index === 0)
        return {
            note: "I",
            color: "tonic",
            chord: "",
        };
    if (index === 1)
        return {
            note: "ii",
            color: "mid",
            chord: "-",
        };
    if (index === 2)
        return {
            note: "iii",
            color: "low",
            chord: "-",
        };
    if (index === 3)
        return {
            note: "IV",
            color: "high",
            chord: "",
        };
    if (index === 4)
        return {
            note: "V",
            color: "low",
            chord: "",
        };
    if (index === 5)
        return {
            note: "vi",
            color: "mid",
            chord: "-",
        };
    if (index === 6)
        return {
            note: "vii°",
            color: "high",
            chord: "°",
        };

    return {
        note: "",
        color: "transparent",
    };
};

const getChordFilePath = (
    chord: string,
    index: number | null,
    pitch: number,
    keyValue: string,
    scaleNotes: string[],
    chordType: ChordTypes
) => {
    const dim = chord.includes("°");
    let setPitch = pitch.toString();
    if (keyValue !== "C") {
        let findRootIndex = 0;
        if (scaleNotes.includes("C")) {
            findRootIndex = scaleNotes.indexOf("C");
        } else if (scaleNotes.includes("C#")) {
            findRootIndex = scaleNotes.indexOf("C#");
        }
        if (index && index >= findRootIndex) {
            setPitch = (pitch + 1).toString();
        }
    }
    const subFilePath = `${chord
        .replace("#", "s")
        .replace("°", "dim")}${setPitch}.mp3`;
    let subFolder;
    if (chordType === "7th") {
        if (chord.includes("-7b5")) {
            subFolder = "minor-seven-flat-five";
        } else if (chord.includes("maj7")) {
            subFolder = "major-seven";
        } else if (chord.includes("-7")) {
            subFolder = "minor-seven";
        } else {
            subFolder = "seven";
        }
    }
    const selectFolder = subFolder ? subFolder : dim ? "dim" : "triad";
    return `/samples/chords/${selectFolder}/${subFilePath}`;
};

const isEmpty = (obj: Record<string, AudioBuffer>) =>
    obj && Object.keys(obj).length === 0 && obj.constructor === Object;

const createPianoRoll = (
    notes: string[],
    pianoRollLength: number,
    keyValue: string
) => {
    const getPianoRoll = [];
    for (let index = 0; index < pianoRollLength; index++) {
        for (let innerIndex = 0; innerIndex < notes.length; innerIndex++) {
            let setPitch = `${index + 1}`;
            if (keyValue !== "C") {
                let findRootIndex = 0;
                if (notes.includes("C")) {
                    findRootIndex = notes.indexOf("C");
                } else if (notes.includes("C#")) {
                    findRootIndex = notes.indexOf("C#");
                }
                if (innerIndex && innerIndex >= findRootIndex) {
                    setPitch = `${index + 2}`;
                }
            }
            const getNote = notes[innerIndex].replace("#", "s");
            if (index + 2 < 6) {
                getPianoRoll.push(`${getNote}${setPitch}`);
            }
        }
    }
    return getPianoRoll.reverse();
};

export { getChordFilePath, getNote, createPianoRoll, isEmpty };
