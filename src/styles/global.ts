import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

export const colors = {
    tonic: { value: "rgb(0,100,0)" },
    low: { value: "rgb(127,0,255)" },
    mid: { value: "rgb(255,105,180)" },
    high: { value: "rgb(254,4,6)" },
};

const config = defineConfig({
    theme: {
        tokens: {
            colors,
        },
    },
});

const system = createSystem(defaultConfig, config);

export default system;
