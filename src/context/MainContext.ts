// ThemeContext.js
import type { MainContextProps } from "@/types";
import { createContext } from "react";

const MainContext = createContext<MainContextProps | undefined>(undefined);

export default MainContext;
