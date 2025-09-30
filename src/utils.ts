import { enharmonic } from "@tonaljs/note";

const getColor = (index: number) => {
    if (index === 1 || index === 3) return "mid";
    if (index === 2 || index === 5) return "low";
    if (index === 4 || index === 6) return "high";
    return "tonic";
};
const getNote = (mode: "Minor" | "Major", index: number) => {
    if (mode === "Minor") {
        if (index === 0) return "i";
        if (index === 1) return "ii°";
        if (index === 2) return "III";
        if (index === 3) return "iv";
        if (index === 4) return "v";
        if (index === 5) return "VI";
        if (index === 6) return "VII";
    } else {
        if (index === 0) return "I";
        if (index === 1) return "ii";
        if (index === 2) return "iii";
        if (index === 3) return "IV";
        if (index === 4) return "V";
        if (index === 5) return "vi";
        if (index === 6) return "vii°";
    }
    return "";
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

export { getColor, getNote, getChord };
