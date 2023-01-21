export interface IValidation {
    order: number;
    name: string;
    error: string;
    func: (value: string) => boolean;
}

export interface IFormInputData {
    label: string,
    type: string,
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
