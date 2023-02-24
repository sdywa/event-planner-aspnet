import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import User from "./store/User";

interface globalStore {
    user: User
}

const user = new User();

export const Context = createContext<globalStore>({user});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Context.Provider value={{user}}>
        <App />
    </Context.Provider>
);
