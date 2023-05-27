export interface IServerResponse {
    errors: {
        [key: string]: string | string[];
    };
    status: number;
    title: string;
    traceId: string;
}

export interface IToken {
    token: string;
    created: string;
    expires: string;
}

export enum UserRoles {
    Participant = "Participant",
    Organizer = "Organizer",
    Administrator = "Administrator",
}

export interface IUser {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: UserRoles;
}

export interface IAuthResponse {
    accessToken: IToken;
    refreshToken: IToken;
    user?: IUser;
}

export interface IAddress {
    latitude: number;
    longitude: number;
    full: string;
    region: string;
    city: string;
    street: string;
    house: string;
    block?: string;
}

// Common interface
export interface IDefaultEvent {
    title: string;
    cover?: string;
    description: string;
    category: {
        id: number;
        title: string;
    };
    type: {
        id: number;
        title: "Оффлайн" | "Онлайн";
    };
    startDate?: string;
    endDate?: string;
    address?: IAddress;
}

// Showing on events page
export interface IEventResponse extends IDefaultEvent {
    id: number;
    isFavorite: boolean;
}

export interface IExtendedEventResponse extends IEventResponse {
    fullDescription: string;
    creator: {
        id: number;
        name: string;
        surname: string;
        eventsCount: number;
        rating: number;
    };
    questions: IEventQuestion[];
    tickets: IEventTicket[];
}

export interface IEventQuestion {
    id: number;
    title: string;
    isEditable?: boolean;
}

export interface IEventQuestionResponse {
    title: string;
    questions: IEventQuestion[];
}

export interface IEventTicket {
    id: number;
    title: string;
    limit?: number;
    until: string;
    price: number;
}

export interface IEventTicketResponse {
    title: string;
    tickets: IEventTicket[];
}

export interface IAnswer {
    questionId: number;
    text: string;
}

export interface IParticipationModel {
    answers: IAnswer[];
    ticketId: number;
}

export enum Status {
    Active,
    Waiting,
    Closed,
}

export interface IEventTicketsStatistics {
    id: number;
    title: string;
    income: number;
    price: number;
    salesCount: number;
    status: Status;
    sales: {
        [date: string]: number;
    };
}

export interface IEventStatistics {
    count: number;
    income: number;
    tickets: IEventTicketsStatistics[];
}

export interface IEventStatisticsResponse extends IEventStatistics {
    title: string;
}

export interface IEventParticipant {
    id: number;
    name: string;
    surname: string;
    email: string;
    answers: {
        question: string;
        text: string;
    }[];
}

export interface IEventParticipantsResponse {
    title: string;
    participants: IEventParticipant[];
}

export interface IEventChat {
    id: number;
    theme: string;
    status: Status;
}

export interface IMessage {
    creator: string;
    creationTime: string;
    text: string;
}

export interface IChat {
    id: number;
    theme: string;
    status: Status;
    creator: string;
    creationTime: string;
    messages: IMessage[];
}

export interface IEventChatResponse {
    title: string;
    chats: IEventChat[];
}
