import React from "react"
import { Events } from "../pages/events/Events";
import { Event } from "../pages/event/Event";
import Learn from "../pages/learn/Learn";
import { Login } from "../pages/login/Login";
import { Signup } from "../pages/signup/Signup";

interface route {
    path: string;
    component: React.FC;
}

export const routes: route[] = [
    { path: "/", component: Events },
    { path: "/events/:id", component: Event },
    { path: "/learn", component: Learn },
];

export const authRoutes: route[] = [
    { path: "/login", component: Login },
    { path: "/signup", component: Signup }
];
