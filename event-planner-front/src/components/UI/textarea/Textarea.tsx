import { FC } from "react";
import { IFormInputStatus, IValidation } from "../../../types";
import useFormInput from "../../../hooks/forms/useFormInput";

interface ITextareaProps {
    name: string;
    label: string;
    validation: IValidation[];
    serverError: string;
    isSubmitted: boolean;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: any
};

export const Textarea: FC<ITextareaProps> = ({name, label, validation, serverError, isSubmitted, callBack,...props}) => {
    const {value, errorText, getClassName, ...inputData} = useFormInput<HTMLTextAreaElement>(
        "", 
        name, 
        validation, 
        isSubmitted, 
        serverError, 
        {
            default: "w-full h-full py-2 px-4 rounded-md border-2 border-lightgray focus:outline-none focus:border-green",
            active: "input--active",
            dirty: "input--dirty",
            error: "border-red"
        },
        callBack);

    return (
        <div>
            <div className="w-[44rem]">
                <label htmlFor={name} className="">
                    {label}
                </label>
                <textarea name={name} {...props} value={value} {...inputData} className={getClassName()} />
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{errorText}</div>
        </div>
    );
}
