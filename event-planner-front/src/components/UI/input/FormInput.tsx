import React, { FC, useEffect, useState } from "react";
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

export const FormInput: FC<IFormInputProps> = ({name, data, serverError, isSubmitted, callBack,...props}) => {
    const {error, isDirty, isActive, validation, showingError, onChange, ...inputData} = useInputStatus(name, data, callBack);
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

    return (
        <div className="input-box">
            <Input {...props} name={name} isDirty={isDirty} isActive={isActive} 
                onChange={onChangePrepared} {...inputData} error={inputError} />
            <div className="error-text">{inputError}</div>
        </div>
    );
}
