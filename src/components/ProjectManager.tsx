import { useMainContext } from "@/context/useMainContext";
import { Flex, Heading, Box, Button } from "@chakra-ui/react";
import { useRef } from "react";

const ProjectManager = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        tempo,
        pitch,
        keyValue,
        mode,
        isMetronomeOn,
        setTempo,
        setPitch,
        setKeyValue,
        setMode,
        setIsMetronomeOn,
        melodies,
        setMelodies,
        noteCellSize,
        setNoteCellSize,
        setUploading,
        isPlayingGlobal,
    } = useMainContext();

    const handleDownload = () => {
        const data = {
            tempo,
            pitch,
            keyValue,
            mode,
            isMetronomeOn,
            melodies,
            noteCellSize,
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `melody-builder-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploading(true);
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.tempo) setTempo(json.tempo);
                if (json.keyValue) setKeyValue(json.keyValue);
                if (json.mode) setMode(json.mode);
                if (json.pitch) setPitch(json.pitch);
                if (json.isMetronomeOn) setIsMetronomeOn(json.isMetronomeOn);
                if (json.melodies) setMelodies(json.melodies);
                if (json.noteCellSize) setNoteCellSize(json.noteCellSize);
            } catch {
                alert("Invalid JSON file.");
            } finally {
                setTimeout(() => {
                    setUploading(false);
                }, 1500);
            }
        };

        reader.readAsText(file);
    };

    return (
        <Box my="100px">
            <Heading as="h3" size="xl" userSelect="none" mb={2}>
                Downloader & Uploader
            </Heading>
            <Flex gap={4} align="center">
                <Button
                    colorScheme="teal"
                    variant="solid"
                    size="md"
                    onClick={handleDownload}
                    disabled={isPlayingGlobal}
                >
                    Download
                </Button>
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleUpload}
                    style={{ display: "none" }}
                    accept="application/json"
                />
                <Button
                    colorScheme="teal"
                    variant="solid"
                    size="md"
                    onClick={() => inputRef.current?.click()}
                    disabled={isPlayingGlobal}
                >
                    Upload
                </Button>
            </Flex>
        </Box>
    );
};

export default ProjectManager;
