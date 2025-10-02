import { enharmonic } from "@tonaljs/note";

const getNote = (mode: "Minor" | "Major", index: number) => {
    if (mode === "Minor") {
        if (index === 0)
            return {
                note: "i",
                color: "tonic",
            };
        if (index === 1)
            return {
                note: "ii°",
                color: "mid",
            };
        if (index === 2)
            return {
                note: "III",
                color: "low",
            };
        if (index === 3)
            return {
                note: "iv",
                color: "mid",
            };
        if (index === 4)
            return {
                note: "v",
                color: "high",
            };
        if (index === 5)
            return {
                note: "VI",
                color: "low",
            };
        if (index === 6)
            return {
                note: "VII",
                color: "high",
            };
    }
    if (index === 0)
        return {
            note: "I",
            color: "tonic",
        };
    if (index === 1)
        return {
            note: "ii",
            color: "mid",
        };
    if (index === 2)
        return {
            note: "iii",
            color: "low",
        };
    if (index === 3)
        return {
            note: "IV",
            color: "high",
        };
    if (index === 4)
        return {
            note: "V",
            color: "low",
        };
    if (index === 5)
        return {
            note: "vi",
            color: "mid",
        };
    if (index === 6)
        return {
            note: "vii°",
            color: "high",
        };

    return {
        note: "",
        color: "transparent",
    };
};

const getChord = (
    chord: string,
    index: number | null,
    pitch: number,
    keyValue: string,
    scaleNotes: string[],
    filePath: boolean
) => {
    let setChord;
    if (chord.includes("b")) {
        setChord = enharmonic(chord);
        setChord = setChord.replace("#", "sharp");
    } else {
        setChord = chord.replace("#", "sharp");
    }
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
    if (filePath) {
        return `/samples/chords/${setChord}${setPitch}.mp3`;
    }
    return `${setChord}${setPitch}`;
};

export { getChord, getNote };
