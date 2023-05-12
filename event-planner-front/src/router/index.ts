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
import { Participants } from "../pages/event/info/Participants";
import { Feedback } from "../pages/event/info/feedback/Feedback";
import { Chat } from "../pages/event/info/feedback/Chat";

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
    { path: "/events/:eventId/statistics", component: Statistics },
    { path: "/events/:eventId/participants", component: Participants },
    { path: "/events/:eventId/feedback", component: Feedback },
    { path: "/events/:eventId/chats/:chatId", component: Chat },
    { path: "/learn", component: Learn },
    { path: "/settings", component: Settings }
];

export const authRoutes: route[] = [
    { path: "/login", component: Login },
    { path: "/signup", component: Signup }
];
