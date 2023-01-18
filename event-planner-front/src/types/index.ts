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
