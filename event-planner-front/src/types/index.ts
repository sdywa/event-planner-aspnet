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

export interface IFieldStatus {
    name: string,
    value: string,
    hasError: boolean,
    isActive: boolean,
    isDirty: boolean,
    removeDirty: () => void
}

export interface IServerError {
    [key: string]: string
}

export interface IEvent {
    id: number,
    title: string,
    coverUrl?: string,
    description: string,
    category: string,
    type: "Offline" | "Online",
    date: string,
    location?: string,
    minPrice: number,
    isFavorite: boolean
}

export interface IExtendedEvent extends IEvent {
    fullDescription: string,
    creator: {
        name: string,
        eventsCount: number,
        rating: number
    }
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
