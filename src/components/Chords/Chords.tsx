import { useMainContext } from "@/context/useMainContext";
import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import ChordButton from "./ChordButton";

const Chords = () => {
    const { scaleChords } = useMainContext();
    return (
        <Box>
            <Heading as="h3" size="2xl" userSelect="none" mb={2}>
                Chords
            </Heading>
            <Flex gap={4} align="center">
                <SimpleGrid columns={7} gap="4" w="100%" h="100%" flex="1">
                    {scaleChords.map((chord, index) => (
                        <ChordButton key={index} chord={chord} index={index} />
                    ))}
                </SimpleGrid>
            </Flex>
        </Box>
    );
};

export default Chords;
