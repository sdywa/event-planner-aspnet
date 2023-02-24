export interface IServerResponse {
    errors: {
        [key: string]: string | string[];
    };
    status: number;
    title: string;
    traceId: string;
}

interface IToken {
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
    name: string;
    surname: string;
    role: UserRoles;
}

export interface IAuthResponse {
    accessToken: IToken;
    refreshToken: IToken;
    user: IUser;
}
