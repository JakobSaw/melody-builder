import { Provider } from "@/components/ui/provider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { MainProvider } from "./context/MainContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider>
            <MainProvider>
                <App />
            </MainProvider>
        </Provider>
    </React.StrictMode>
);
