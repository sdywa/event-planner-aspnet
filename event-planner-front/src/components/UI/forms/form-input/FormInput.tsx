import React, { FC, useEffect, useState } from "react";
import { IFormInputData, IFieldStatus } from "../../../../types";
import useFormInputStatus from "../../../../hooks/forms/useFormInputStatus";

interface IFormInputProps {
    name: string,
    data: IFormInputData,
    serverError: string,
    isSubmitted: boolean,
    callBack: (name: string, value: IFieldStatus) => void,
    [key: string]: any
};

export const FormInput: FC<IFormInputProps> = ({name, data, serverError, isSubmitted, callBack,...props}) => {
    const {error, isDirty, isActive, validation, showingError, onChange, value, ...inputData} = useFormInputStatus(name, data, callBack);
    const [isShowed, setShowed] = useState(true);
    const [inputError, setInputError] = useState("");
    
    useEffect(() => {
        if (isSubmitted)
            setShowed(false);
    }, [isSubmitted]);

    useEffect(() => {
        console.log(showingError, !isShowed, !isDirty);
        setInputError("");

        if (!isShowed)
            setInputError(error ? error : serverError)
        else if (showingError)
            setInputError(error);
        else if (!isDirty && !isActive)
            setInputError(serverError);
    }, [showingError, serverError, error, isShowed, isDirty, isActive]);

    function onChangePrepared(e: React.ChangeEvent<HTMLInputElement>) {
        setShowed(true);
        onChange(e);
    }

    function getClassName() {
        const className = ["input pt-6"];
        if (isActive) 
            className.push("input--active");

        if (isDirty && value)
            className.push("input--dirty");
        
        if (inputError)
            className.push("input--error");

        return className.join(" ");
    }

    return (
        <div className="w-full">
            <div className="input-box">
                <input name={name} {...props} value={value} 
                    onChange={onChangePrepared} {...inputData} className={getClassName()}
                />
                <label htmlFor={name} className="input-label">
                    <span className="label-content absolute bottom-0 left-1.5 pb-1 transition-all duration-300 ease-in">{data.label}</span>
                </label>
            </div>
            <div className="error-text h-6 pt-1 pb-2">{inputError}</div>
        </div>
    );
}
