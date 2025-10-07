"use client";

import { Box, Button, Heading } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Moon, Sun } from "lucide-react";

const ColorModeToggle = () => {
    const { toggleColorMode, colorMode } = useColorMode();
    return (
        <Box mt="10">
            <Heading as="h3" size="xl" userSelect="none" mb={2}>
                Color Mode
            </Heading>
            <Button variant="outline" onClick={toggleColorMode}>
                {colorMode === "light" ? <Sun /> : <Moon />}
            </Button>
        </Box>
    );
};

export default ColorModeToggle;
