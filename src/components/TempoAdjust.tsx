// TempoAdjust.tsx
import { useMainContext } from "@/context/useMainContext";
import { Box, Flex, Heading, Input } from "@chakra-ui/react";
import { Plus, Minus } from "lucide-react";

const TempoAdjust = () => {
    const { tempo, setTempo, isPlayingGlobal, color, colorHover } =
        useMainContext();
    return (
        <Box>
            <Heading as="h3" size="2xl" userSelect="none" mb={2}>
                Tempo
            </Heading>
            <Flex gap={4} align="center">
                <Box
                    cursor={isPlayingGlobal ? "disabled" : "pointer"}
                    p="4"
                    border={`2px solid ${color}`}
                    _hover={{ bg: colorHover }}
                    onClick={() => {
                        if (isPlayingGlobal) return;
                        setTempo((prev) => Math.max(1, prev - 1));
                    }}
                >
                    <Minus />
                </Box>
                <Input
                    type="number"
                    value={tempo}
                    onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= 300) {
                            setTempo(val);
                        }
                    }}
                    min={1}
                    max={300}
                    width="100px"
                    textAlign="center"
                    fontSize="2xl"
                    fontWeight="bold"
                    color={color}
                    bg="transparent"
                    boxShadow="none"
                    border={`2px solid ${color}`}
                    _hover={{ bg: colorHover }}
                    className="number-input"
                    disabled={isPlayingGlobal}
                />
                <Box
                    cursor={isPlayingGlobal ? "disabled" : "pointer"}
                    p="4"
                    border={`2px solid ${color}`}
                    _hover={{ bg: colorHover }}
                    onClick={() => {
                        if (isPlayingGlobal) return;
                        setTempo((prev) => Math.min(300, prev + 1));
                    }}
                >
                    <Plus />
                </Box>
            </Flex>
        </Box>
    );
};

export default TempoAdjust;
