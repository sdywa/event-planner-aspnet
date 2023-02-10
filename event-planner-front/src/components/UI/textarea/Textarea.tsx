import { FC } from "react";
import { IFormInputStatus } from "../../../types";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH } from "../../../hooks/useValidation";
import useFormInput from "../../../hooks/forms/useFormInput";
import clsx from "clsx";

interface ITextareaProps {
    name: string;
    label: string;
    serverError: string;
    minLength?: number;
    maxLength?: number;
    className?: string;
    isSubmitted: boolean;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: any
};

export const Textarea: FC<ITextareaProps> = ({name, label, serverError, isSubmitted, callBack, minLength=0, maxLength=0, className, ...props}) => {
    const validation = [ IS_NOT_EMPTY() ];
    if (minLength > 0)
        validation.push(MIN_LENGTH(minLength));

    if (maxLength > 0 && maxLength > minLength)
        validation.push(MAX_LENGTH(maxLength));
    const {value, errorText, getClassName, ...inputData} = useFormInput<HTMLTextAreaElement>(
        "", 
        name, 
        validation, 
        isSubmitted, 
        serverError, 
        {
            default: "textarea",
            active: "textarea--active",
            dirty: "textarea--dirty",
            error: "textarea--error"
        },
        callBack);

    return (
        <div className="h-full">
            <div className="w-[44rem] h-full">
                <label htmlFor={name} className="font-medium">
                    {label}
                </label>
                <textarea name={name} {...props} value={value} {...inputData} className={clsx(getClassName(), className)} />
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pb-2">{errorText}</div>
        </div>
    );
}
