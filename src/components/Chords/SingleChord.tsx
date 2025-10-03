import { useMainContext } from "@/context/useMainContext";
import type { SingleChordProps } from "@/types";
import { getNote } from "@/utils";
import { NativeSelect } from "@chakra-ui/react";

const SingleChord: React.FC<SingleChordProps> = ({
    step,
    chordTimeline,
    setChordTimeline,
}) => {
    const { scaleChords, color, colorHover, mode, chordType } =
        useMainContext();
    const chord = chordTimeline[step];

    const changeChord = (chord: string, step: number) => {
        const newChordTimeline = [...chordTimeline];
        if (!chord) {
            newChordTimeline[step] = "";
        } else {
            newChordTimeline[step] = chord;
        }
        setTimeout(() => setChordTimeline(newChordTimeline), 50);
    };

    return (
        <NativeSelect.Root className="align-select">
            <NativeSelect.Field
                value={chord}
                onChange={(e) => changeChord(e.target.value, step)}
                fontSize="xl"
                w="auto"
                px={4}
                border={`2px solid ${color}`}
                color={color}
                bg={
                    chord
                        ? getNote(mode, chordType, scaleChords.indexOf(chord))
                              .color
                        : "transparent"
                }
                _hover={chord ? {} : { bg: colorHover }}
                cursor="pointer"
            >
                <option value="" style={{ color: "black" }}></option>
                {scaleChords
                    .filter((filterChord) => !filterChord.includes("°"))
                    .map((chord) => (
                        <option
                            key={chord}
                            value={chord}
                            style={{ color: "black" }}
                        >
                            {chord}
                        </option>
                    ))}
            </NativeSelect.Field>
        </NativeSelect.Root>
    );
};

export default SingleChord;
