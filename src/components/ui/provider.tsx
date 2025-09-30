"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import system from "../../styles/global";

export function Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={{ ...defaultSystem, ...system }}>
            <ColorModeProvider {...props} />
        </ChakraProvider>
    );
}
