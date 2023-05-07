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
    Administrator = "Administrator"
}

export interface IUser {
    id: number,
    email: string,
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
    title: string,
    cover?: string,
    description: string,
    category: {
        id: number,
        title: string
    },
    type: {
        id: number,
        title: "Оффлайн" | "Онлайн"
    },
    startDate?: string,
    endDate?: string,
    address?: IAddress,
}

// Showing on events page
export interface IEventResponse extends IDefaultEvent {
    id: number,
    isFavorite: boolean
}

export interface IExtendedEventResponse extends IEventResponse {
    fullDescription: string,
    creator: {
        id: number,
        name: string,
        surname: string,
        eventsCount: number,
        rating: number
    },
    questions: IEventQuestion[],
    tickets: IEventTicket[]
}

export interface IEventQuestion {
    id: number,
    title: string,
    isEditable?: Boolean
}

export interface IEventQuestionResponse {
    title: string,
    questions: IEventQuestion[]
}

export interface IEventTicket {
    id: number,
    title: string,
    limit?: number,
    until: string,
    price: number
};

export interface IEventTicketResponse {
    title: string,
    tickets: IEventTicket[]
}

export interface IAnswer {
    questionId: number,
    text: string
}

export interface IParticipationModel {
    answers: IAnswer[],
    ticketId: number
}

export enum IStatus {
    active,
    waiting,
    closed
}
