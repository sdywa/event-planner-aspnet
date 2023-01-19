import { FC } from "react";
import { IFormInputData, IFieldStatus } from "../../../types";
import { Input } from "./Input";
import useInputStatus from "../../../hooks/useInputStatus";

interface IFormInputProps {
    name: string,
    data: IFormInputData,
    serverError: string,
    isSubmitted: boolean,
    callBack: (name: string, value: IFieldStatus) => void,
    [key: string]: any
};

export const FormInput: FC<IFormInputProps> = ({name, data, serverError, isSubmitted, callBack, ...props}) => {
    const {error, isDirty, validation, ...inputData} = useInputStatus(name, data, callBack);

    return (
        <Input {...props} name={name} isDirty={isDirty} {...inputData}
            error={error ? error : !isDirty ? serverError : ''} 
            isSubmitted={isSubmitted} />
    );
}
