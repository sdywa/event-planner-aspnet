import { FC, useState, useEffect } from "react";
import { IFormInputData, IFieldStatus } from "../../../types";
import useFormInputStatus from "../../../hooks/forms/useFormInputStatus";

interface ITextareaProps {
    name: string,
    data: IFormInputData,
    serverError: string,
    isSubmitted: boolean,
    callBack: (name: string, value: IFieldStatus) => void,
    [key: string]: any
};

export const Textarea: FC<ITextareaProps> = ({name, data, serverError, isSubmitted, callBack,...props}) => {
    const {error, isDirty, isActive, validation, showingError, onChange, value, ...inputData} = useFormInputStatus<HTMLTextAreaElement>(name, data, callBack);
    const [isShowed, setShowed] = useState(true);
    const [inputError, setInputError] = useState("");
    
    useEffect(() => {
        if (isSubmitted)
            setShowed(false);
    }, [isSubmitted]);

    useEffect(() => {
        setInputError("");

        if (!isShowed)
            setInputError(error ? error : serverError)
        else if (showingError)
            setInputError(error);
        else if (!isDirty && !isActive)
            setInputError(serverError);
    }, [showingError, serverError, error, isShowed, isDirty, isActive]);

    function onChangePrepared(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setShowed(true);
        onChange(e);
    }

    function getClassName() {
        const className = ["w-full h-full py-2 px-4 rounded-md border-2 border-lightgray focus:outline-none focus:border-green"];
        if (isActive) 
            className.push("input--active");

        if (isDirty && value)
            className.push("input--dirty");
        
        if (inputError)
            className.push("border-red");

        return className.join(" ");
    }

    return (
        <div>
            <div className="w-[44rem]">
                <label htmlFor={name} className="">
                    {data.label}
                </label>
                <textarea name={name} {...props} value={value} onChange={onChangePrepared} {...inputData} className={getClassName()} />
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{inputError}</div>
        </div>
    );
}
