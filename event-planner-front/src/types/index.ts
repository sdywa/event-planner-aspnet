import { IEventResponse, IDefaultEvent } from "./Api";

export interface IValidation {
    order: number;
    name: string;
    error: string;
    func: (value: string) => boolean;
}

export interface IFilter<T> {
    name: string;
    func: (value: T) => boolean;
}

export interface IFormInputData {
    label: string,
    type: "text" | "password",
    autoComplete: string,
    validation: IValidation[]
}

export interface IFormInputStatus {
    name: string,
    value: any,
    hasError: boolean,
    isActive: boolean,
    isDirty: boolean,
    removeDirty: () => void
}

export interface IServerError {
    [key: string]: string
}

// Interface for creator
export interface IExtendedEvent extends IDefaultEvent {
    fullDescription: string,
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

export interface IEditEvent extends IDefaultEvent {
    id: number,
    questions: IEventQuestion[],
    tickets: IEventTicket[]
}

// Showing on event page
export interface IUserExtendedEvent extends IEventResponse, IExtendedEvent {
    creator: {
        id: number,
        name: string,
        eventsCount: number,
        rating: number
    },
    questions: IEventQuestion[],
    tickets: IEventTicket[]
}
