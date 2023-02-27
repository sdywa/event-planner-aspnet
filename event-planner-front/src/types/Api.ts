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
    address?: string,
}

// Showing on events page
export interface IEventResponse extends IDefaultEvent {
    id: number,
    isFavorite: boolean
    minPrice: number
}
