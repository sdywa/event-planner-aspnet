import React from "react"
import Events from "../pages/events/Events";
import Event from "../pages/event/Event";
import Learn from "../pages/learn/Learn";
import { Login } from "../pages/login/Login";
import { Signup } from "../pages/signup/Signup";
import { EditEvent } from "../pages/event/setup/EditEvent";
import { QuestionsPage } from "../pages/event/setup/QuestionsPage";
import { TicketsPage } from "../pages/event/setup/TicketsPage";
import Settings from "../pages/Settings";
import { Statistics } from "../pages/event/info/Statistics";

interface route {
    path: string;
    component: React.FC;
}

export const routes: route[] = [
    { path: "/", component: Events },
    { path: "/events/:eventId", component: Event },
    { path: "/events/new", component: EditEvent },
    { path: "/events/:eventId/edit", component: EditEvent },
    { path: "/events/:eventId/questions", component: QuestionsPage },
    { path: "/events/:eventId/tickets", component: TicketsPage },
    { path: "/events/:eventId/statistics", component: Statistics},
    { path: "/learn", component: Learn },
    { path: "/settings", component: Settings }
];

export const authRoutes: route[] = [
    { path: "/login", component: Login },
    { path: "/signup", component: Signup }
];
