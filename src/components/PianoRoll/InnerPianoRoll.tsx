import { Box, Grid, Flex, Text } from "@chakra-ui/react";
import type { InnerPianoRollProps } from "@/types";
import { useMainContext } from "@/context/useMainContext";
import PianoRollCell from "./PianoRollCell";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useColorMode } from "../ui/color-mode";

const InnerPianoRoll: React.FC<InnerPianoRollProps> = ({
    numberOfNotesInMelody,
    mainRef,
    verticalRef,
    grid,
    setGrid,
    isPlaying,
    isScrolling,
}) => {
    const {
        pianoRoll,
        pianoRollMaxWidth,
        pianoRollMaxHeight,
        marginLeft,
        hideScrollBar,
        noteCellSize,
        noteCellRatio,
    } = useMainContext();

    const { colorMode } = useColorMode();
    const [hideXSideBar, setHideXSideBar] = useState<boolean>(false);

    const PianoRollAxis = ({
        keyDown,
        note,
    }: {
        keyDown: number;
        note: string;
    }) => {
        const [showX, setShowX] = useState<boolean>(false);
        useEffect(() => {
            if (isScrolling && showX) {
                setShowX(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isScrolling]);
        useEffect(() => {
            if (hideXSideBar) {
                setShowX(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [hideXSideBar]);
        return (
            <Flex
                align="center"
                cursor={"pointer"}
                onMouseEnter={() => setShowX(true)}
                onMouseLeave={() => setShowX(false)}
            >
                {showX ? (
                    <Box
                        onClick={() => {
                            const newEmptyRow = Array(
                                numberOfNotesInMelody
                            ).fill(false);
                            const newGrid = [...grid];
                            newGrid[keyDown] = newEmptyRow;
                            setGrid(newGrid);
                            setShowX(false);
                        }}
                    >
                        <X color="red" />
                    </Box>
                ) : (
                    <Text fontSize={"18px"}>{note.replace("s", "#")}</Text>
                )}
            </Flex>
        );
    };

    useEffect(() => {
        if (hideScrollBar) {
            setTimeout(() => {
                setHideXSideBar(false);
            }, 500);
        }
    }, [hideScrollBar]);

    return (
        <Box pos={"relative"}>
            {/* SideBar with PianoRoll Notes */}
            <Grid
                w={"40px"}
                templateRows={`repeat(${pianoRoll.length}, ${noteCellSize}px)`}
                gap={1}
                pos={"absolute"}
                top={0}
                left={0}
                bg={colorMode === "light" ? "white" : "black"}
                zIndex={3}
                maxH={pianoRollMaxHeight}
                overflow={"scroll"}
                css={hideScrollBar}
                ref={verticalRef}
                onMouseLeave={() => {
                    setHideXSideBar(true);
                }}
            >
                {pianoRoll.map((note, index) => (
                    <PianoRollAxis key={index} note={note} keyDown={index} />
                ))}
            </Grid>
            {/* Piano Roll */}
            <Box
                overflow={"scroll"}
                maxW={`${pianoRollMaxWidth}px`}
                maxH={pianoRollMaxHeight}
                pl={`${marginLeft}px`}
                pos={"relative"}
                ref={mainRef}
                css={hideScrollBar}
                zIndex={2}
            >
                <Grid
                    templateColumns={`repeat(${numberOfNotesInMelody}, ${
                        noteCellSize * noteCellRatio
                    }px)`}
                    templateRows={`repeat(${pianoRoll.length}, ${noteCellSize}px)`}
                    gap={1}
                >
                    {Array.from({
                        length: pianoRoll.length * numberOfNotesInMelody,
                    }).map((_, index) => (
                        <PianoRollCell
                            key={index}
                            cellIndex={index}
                            grid={grid}
                            setGrid={setGrid}
                            numberOfNotesInMelody={numberOfNotesInMelody}
                            isPlaying={isPlaying}
                        />
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default InnerPianoRoll;
