import { useMainContext } from "@/context/useMainContext";
import type { ChordButtonProps } from "@/types";
import { getChord, getNote } from "@/utils";
import { Flex, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const ChordButton: React.FC<ChordButtonProps> = ({ chord, index }) => {
    const { mode, pitch, keyValue, scaleNotes, color, colorHover } =
        useMainContext();
    const dim = chord.includes("°");
    const [isActive, setIsActive] = useState<boolean>(false);
    const playChord = useCallback(() => {
        if (dim) return;
        setIsActive(true);
        setTimeout(() => setIsActive(false), 300);
        const filePath = getChord(chord, index, pitch, keyValue, scaleNotes);
        const audio = new Audio(filePath);
        audio.play().catch((err) => {
            console.error("Audio play failed:", err);
        });
    }, [pitch, chord, dim, index, keyValue, scaleNotes]);

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
            borderColor={getNote(mode, index).color}
            boxShadow={isActive ? `0 0 10px 2px ${color}` : "none"}
            bg={isActive ? colorHover : "none"}
            transition="all 0.2s"
            align="center"
            p="4"
            textAlign="center"
            cursor={dim ? "disabled" : "pointer"}
            onClick={playChord}
        >
            <Heading as="h1" size="4xl" userSelect="none">
                {chord}
            </Heading>
            <Heading as="h1" size="4xl" userSelect="none">
                {getNote(mode, index).note}
            </Heading>
        </Flex>
    );
};
export default ChordButton;
