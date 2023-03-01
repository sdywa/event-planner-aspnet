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
    country: string,
    region: string,
    city: string,
    street: string
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
        eventsCount: number,
        rating: number
    },
    questions: IEventQuestion[],
    tickets: IEventTicket[]
}

export interface IEventQuestion {
    id: number,
    name: string,
    editable?: Boolean
}

export interface IEventTicket{
    id: number,
    name: string,
    limit?: number,
    until: string,
    price: number
};
