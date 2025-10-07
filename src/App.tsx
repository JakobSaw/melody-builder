// App.tsx
import { Flex, Heading } from "@chakra-ui/react";
import TempoAdjust from "./components/TempoAdjust";
import KeySelector from "./components/KeySelector";
import ModeSelector from "./components/ModeSelector";
import Chords from "./components/Chords/Chords";
import Melodies from "./components/Melodies";
import PitchAdjust from "./components/PitchAdjust";
import ProjectManager from "./components/ProjectManager";
import { useMainContext } from "./context/useMainContext";
import MetronomeControl from "./components/PianoRoll/MetronomeControl";
import NoteCellSizer from "./components/NoteCellSizer";
import ColorModeToggle from "./components/ColorModeToggle";
import ChordTypeSelector from "./components/ChordTypeSelector";

const App = () => {
    const { pianoRollMaxWidth } = useMainContext();
    return (
        <>
            <Heading
                as="h1"
                size="4xl"
                textAlign="center"
                my="10"
                userSelect="none"
            >
                Melody Builder
            </Heading>
            <Flex justify="center">
                <Flex
                    direction="column"
                    w="full"
                    maxW={`${pianoRollMaxWidth}px`}
                    gap="10"
                    pb={"100px"}
                >
                    <KeySelector />
                    <ModeSelector />
                    <TempoAdjust />
                    <ChordTypeSelector />
                    <PitchAdjust />
                    <Chords />
                    <Melodies />
                    <NoteCellSizer />
                    <MetronomeControl />
                    <ProjectManager />
                    <ColorModeToggle />
                </Flex>
            </Flex>
        </>
    );
};

export default App;
