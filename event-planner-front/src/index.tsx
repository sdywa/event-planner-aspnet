import React, { createContext } from "react";
import ReactDOM from "react-dom/client";

import { User } from "./store/User";
import { App } from "./App";

import "./index.css";

interface globalStore {
    user: User;
}

const user = new User();

export const UserContext = createContext<globalStore>({ user });

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <UserContext.Provider value={{ user }}>
        <App />
    </UserContext.Provider>
);
