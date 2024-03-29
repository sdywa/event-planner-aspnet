import React from "react";

import { Event } from "../pages/event/Event";
import { Feedback } from "../pages/event/info/Feedback";
import { Participants } from "../pages/event/info/Participants";
import { Statistics } from "../pages/event/info/Statistics";
import { EditEvent } from "../pages/event/setup/EditEvent";
import { QuestionsPage } from "../pages/event/setup/QuestionsPage";
import { TicketsPage } from "../pages/event/setup/TicketsPage";
import { Events } from "../pages/Events";
import { Learn } from "../pages/Learn";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Chats } from "../pages/user/Chats";
import { History } from "../pages/user/History";
import { Settings } from "../pages/user/Settings";
import { UserRole } from "../types/Api";

interface IRoute {
    path: string;
    component: React.FC;
}

export const authRoutes: IRoute[] = [
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
];

export const routes: { [key in UserRole]?: IRoute[] } = {
    [UserRole.Guest]: [
        { path: "/", component: Events },
        { path: "/events/:eventId", component: Event },
        { path: "/learn", component: Learn },
    ],
    [UserRole.Participant]: [
        { path: "/user/settings", component: Settings },
        { path: "/user/history", component: History },
        { path: "/user/chats", component: Chats },
        { path: "/user/chats/:chatId", component: Chats },
    ],
    [UserRole.Organizer]: [
        { path: "/events/new", component: EditEvent },
        { path: "/events/:eventId/edit", component: EditEvent },
        { path: "/events/:eventId/questions", component: QuestionsPage },
        { path: "/events/:eventId/tickets", component: TicketsPage },
        { path: "/events/:eventId/statistics", component: Statistics },
        { path: "/events/:eventId/participants", component: Participants },
        { path: "/events/:eventId/chats", component: Feedback },
        { path: "/events/:eventId/chats/:chatId", component: Feedback },
    ],
};
