import { Box, Grid } from "@chakra-ui/react";
import type { ChordTimelineProps } from "@/types";
import { useMainContext } from "@/context/useMainContext";
import SingleChord from "./SingleChord";
import { X } from "lucide-react";
import { useState } from "react";
import { useColorMode } from "../ui/color-mode";

const ChordTimeline: React.FC<ChordTimelineProps> = ({
    chordTimeline,
    setChordTimeline,
    horizontalRef,
    numberOfNotesInMelody,
}) => {
    const {
        pianoRollMaxWidth,
        marginLeft,
        hideScrollBar,
        noteCellSize,
        noteCellRatio,
    } = useMainContext();
    const [showX, setShowX] = useState<boolean>(false);
    const { colorMode } = useColorMode();
    return (
        <Box position={"relative"}>
            <Box
                bg={colorMode === "light" ? "white" : "black"}
                position={"absolute"}
                w={`${marginLeft}px`}
                height={`${marginLeft}px`}
                top={0}
                left={0}
                zIndex={2}
                onMouseEnter={() => setShowX(true)}
                onMouseLeave={() => setShowX(false)}
            >
                {showX && (
                    <Box
                        cursor={"pointer"}
                        onClick={() => {
                            const emptyChordTimeLine = Array(
                                numberOfNotesInMelody
                            ).fill("");
                            setChordTimeline(emptyChordTimeLine);
                            setShowX(false);
                        }}
                    >
                        <X color="red" />
                    </Box>
                )}
            </Box>
            <Box
                overflow={"scroll"}
                maxW={`${pianoRollMaxWidth}px`}
                mt={4}
                pl={`${marginLeft}px`}
                ref={horizontalRef}
                css={hideScrollBar}
            >
                <Grid
                    id="chordtimeline"
                    templateColumns={`repeat(${numberOfNotesInMelody}, ${
                        noteCellSize * noteCellRatio
                    }px)`}
                    gap={1}
                >
                    {chordTimeline.map((_, stepIdx) => (
                        <SingleChord
                            key={stepIdx}
                            step={stepIdx}
                            chordTimeline={chordTimeline}
                            setChordTimeline={setChordTimeline}
                        />
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default ChordTimeline;
