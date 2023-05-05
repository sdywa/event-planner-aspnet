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
