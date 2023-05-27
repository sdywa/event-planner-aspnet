import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./components/AppRouter";

export function App() {
    return (
        <div className="text-black">
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </div>
    );
}
