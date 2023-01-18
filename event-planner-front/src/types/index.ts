export interface IValidation {
    order: number;
    name: string;
    error: string;
    func: (value: string) => boolean;
}