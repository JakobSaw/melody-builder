import type { RandomizerSelectorProps } from "@/types";
import { Slider, Box, Heading } from "@chakra-ui/react";
import type { FC } from "react";

const RandomizerSelector: FC<RandomizerSelectorProps> = ({
    randomizeLevel,
    setRandomizeLevel,
    deactivateRandomiozeButtons,
}) => {
    return (
        <Box>
            <Heading as="h3" size="md" userSelect="none" mb={2}>
                Randomize Level: {randomizeLevel}
            </Heading>
            <Slider.Root
                width="120px"
                value={[randomizeLevel]}
                min={1}
                max={3}
                step={1}
                cursor={"pointer"}
                disabled={deactivateRandomiozeButtons !== ""}
                onValueChange={(details) => setRandomizeLevel(details.value[0])}
            >
                <Slider.Control>
                    <Slider.Track>
                        <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs />
                </Slider.Control>
            </Slider.Root>
        </Box>
    );
};

export default RandomizerSelector;
