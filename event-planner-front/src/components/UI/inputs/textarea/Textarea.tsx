import { FC, useEffect } from "react";
import { IFormInputStatus } from "../../../../types";
import { IS_NOT_EMPTY, MIN_LENGTH, MAX_LENGTH } from "../../../../hooks/useValidation";
import useFormInput from "../../../../hooks/forms/useFormInput";
import clsx from "clsx";

interface ITextareaProps {
    initialValue?: string;
    name: string;
    label: string;
    serverError: string;
    minLength?: number;
    maxLength?: number;
    className?: string;
    isSubmitted: boolean;
    additionalText?: string;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: any
};

export const Textarea: FC<ITextareaProps> = ({initialValue="", name, label, serverError, isSubmitted, callBack, minLength=0, maxLength=0, className, additionalText, ...props}) => {
    const validation = [ IS_NOT_EMPTY() ];
    if (minLength > 0)
        validation.push(MIN_LENGTH(minLength));

    if (maxLength > 0 && maxLength > minLength)
        validation.push(MAX_LENGTH(maxLength));
    const {value, setValue, errorText, getClassName, ...inputData} = useFormInput<HTMLTextAreaElement>(
        initialValue,
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

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        setValue(initialValue);
    }, [initialValue]);

    return (
        <div>
            <div className="w-full">
                <label htmlFor={name} className="font-medium">
                    {label}
                </label>
                <textarea name={name} {...props} value={value} {...inputData} className={clsx(getClassName(), className)} />
            </div>
            <div className="font-roboto font-bold text-xs h-6 pb-2">
                {
                    errorText
                    ?
                    <span className="text-red">{errorText}</span>
                    :
                    <span className="text-gray">{additionalText}</span>
                }
            </div>
        </div>
    );
}
