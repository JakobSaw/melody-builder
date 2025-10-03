import { useMainContext } from "@/context/useMainContext";
import type { ChordButtonProps } from "@/types";
import { getChordFilePath, getNote } from "@/utils";
import { Flex, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const ChordButton: React.FC<ChordButtonProps> = ({ chord, index }) => {
    const { mode, pitch, keyValue, scaleNotes, color, colorHover, chordType } =
        useMainContext();
    const [isActive, setIsActive] = useState<boolean>(false);
    const playChord = useCallback(() => {
        setIsActive(true);
        setTimeout(() => setIsActive(false), 300);
        const filePath = getChordFilePath(
            chord,
            index,
            pitch,
            keyValue,
            scaleNotes,
            chordType
        );
        const audio = new Audio(filePath);
        audio.play().catch((err) => {
            console.error("Audio play failed:", err);
        });
    }, [pitch, chord, index, keyValue, scaleNotes, chordType]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const active = document.activeElement;

            const isTyping =
                active instanceof HTMLInputElement ||
                active instanceof HTMLTextAreaElement ||
                (active instanceof HTMLElement && active.isContentEditable);

            if (isTyping) return;

            const keyNum = parseInt(e.key, 10);
            if (!isNaN(keyNum) && keyNum === index + 1) {
                playChord();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [index, playChord]);

    return (
        <Flex
            direction="column"
            gap="2"
            borderWidth="4px"
            borderColor={getNote(mode, chordType, index).color}
            boxShadow={isActive ? `0 0 10px 2px ${color}` : "none"}
            bg={isActive ? colorHover : "none"}
            transition="all 0.2s"
            align="center"
            p="4"
            textAlign="center"
            cursor={"pointer"}
            onClick={playChord}
        >
            <Heading as="h1" size="4xl" userSelect="none">
                {chord}
            </Heading>
            <Heading as="h1" size="4xl" userSelect="none">
                {getNote(mode, chordType, index).note}
            </Heading>
        </Flex>
    );
};
export default ChordButton;
