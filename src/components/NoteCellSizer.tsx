import { useMainContext } from "@/context/useMainContext";
import { Slider, Box, Heading } from "@chakra-ui/react";

const NoteCellSizer = () => {
    const { noteCellSize, setNoteCellSize } = useMainContext();

    return (
        <Box mt={10}>
            <Heading as="h3" size="xl" userSelect="none" mb={2}>
                PianoRoll Size
            </Heading>
            <Slider.Root
                width="200px"
                value={[noteCellSize]}
                min={20}
                max={70}
                step={10}
                cursor={"pointer"}
                onValueChange={(details) => setNoteCellSize(details.value[0])}
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

export default NoteCellSizer;
