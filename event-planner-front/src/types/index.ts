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

// Common interface
export interface IEvent {
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

// Interface for creator
export interface IExtendedEvent extends IEvent {
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

export interface IEditEvent extends IEvent {
    id: number,
    questions: IEventQuestion[],
    tickets: IEventTicket[]
}

// Showing on events page
export interface IUserEvent extends IEvent {
    id: number,
    isFavorite: boolean
    minPrice: number
}

// Showing on event page
export interface IUserExtendedEvent extends IUserEvent, IExtendedEvent {
    creator: {
        id: number,
        name: string,
        eventsCount: number,
        rating: number
    },
    questions: IEventQuestion[],
    tickets: IEventTicket[]
}
