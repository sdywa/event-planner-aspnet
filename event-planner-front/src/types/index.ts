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

// Showing on events page
export interface IUserEvent extends IEvent {
    id: number,
    isFavorite: boolean
    minPrice: number
}

// Showing on event page
export interface IUserExtendedEvent extends IUserEvent, IExtendedEvent {
    creator: {
        name: string,
        eventsCount: number,
        rating: number
    },
    questions: {
        id: string,
        name: string
    }[],
    tickets: {
        id: string,
        name: string,
        until: string,
        price: number
    }[]
}
