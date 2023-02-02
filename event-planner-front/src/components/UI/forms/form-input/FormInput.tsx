import { FC } from "react";
import { Input } from "../../input/Input";
import { IFormInputData, IFormInputStatus } from "../../../../types";
import useFormInput from "../../../../hooks/forms/useFormInput";

interface IFormInputProps {
    name: string,
    data: IFormInputData,
    serverError: string,
    isSubmitted: boolean,
    callBack: (name: string, value: IFormInputStatus) => void,
    [key: string]: any
};

export const FormInput: FC<IFormInputProps> = ({name, data, serverError, isSubmitted, callBack,...props}) => {
    const {value, errorText, getClassName, ...inputData} = useFormInput<HTMLInputElement>(
        "", 
        name, 
        data.validation, 
        isSubmitted, 
        serverError, 
        {
            default: "pt-6",
            active: "input--active",
            dirty: "input--dirty",
            error: "input--error"
        },
        callBack);
  

    return (
        <div className="w-full">
            <Input type={data.type} name={name} autoComplete={data.autoComplete} {...props} value={value} {...inputData} className={getClassName()}>
                <span className="label-content absolute bottom-0 left-1.5 pb-1 transition-all duration-300 ease-in">
                    {data.label}
                </span>
            </Input>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{errorText}</div>
        </div>
    );
}
