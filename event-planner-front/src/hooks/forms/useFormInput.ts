import React, { useState, useEffect } from "react";
import { IValidation, IFormInputStatus } from "../../types";
import useValidation from "../useValidation";

interface StatusClasses {
    default: string;
    active: string;
    dirty: string;
    error: string;
}

function useFormInput<T extends HTMLInputElement | HTMLTextAreaElement>(
    initialValue: string, 
    inputName: string, 
    validations: IValidation[],
    isFormSubmitted: boolean,
    serverError: string,
    classes: StatusClasses,
    callBack: (name: string, value: IFormInputStatus) => void) {
    const [value, setValue] = useState(initialValue);
    const [prevValue, setPrevValue] = useState(initialValue);
    
    const [isActive, setActive] = useState(false);
    const [isDirty, setDirty] = useState(false);

    const [isShowedError, setShowedError] = useState(true);
    const [hasError, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const validationError = useValidation(value, [...validations].sort((a, b) => a.order - b.order));

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        callBack(inputName, {
            name: inputName,
            value: value,
            removeDirty: resetInput,
            hasError, 
            isDirty, 
            isActive
        });
    }, [hasError, isDirty, isActive, value]);

    useEffect(() => {
        if (isFormSubmitted)
            setShowedError(false);
    }, [isFormSubmitted]);

    useEffect(() => {
        setErrorText("");

        if (!isShowedError)
            setErrorText(validationError ? validationError : serverError)
        else if (hasError)
            setErrorText(validationError);
        else if (!isDirty && !isActive)
            setErrorText(serverError);
    }, [hasError, isDirty, isActive, serverError, validationError, isShowedError]);

    function getClassName() {
        const className = [classes.default];
        if (isActive) 
            className.push(classes.active);

        if (isDirty && value)
            className.push(classes.dirty);
        
        if (errorText)
            className.push(classes.error);

        return className.join(" ");
    }

    const onChange = (e: React.ChangeEvent<T>) => {
        setValue(e.target.value);
        setError(false);
        setShowedError(true);
    }

    const onFocus = (e: React.FocusEvent<T>) => {
        setActive(true);
    }

    const onBlur = (e: React.FocusEvent<T>) => {
        setActive(false);
        setError(Boolean(validationError));
        if (value !== prevValue)
            setDirty(true);
        else
            setDirty(false);
    }

    const resetInput = () => {
        setDirty(false);
        setError(true);
        setPrevValue(value);
    }

    return { 
        value, errorText, onChange, onFocus, onBlur, getClassName
    };
}

export default useFormInput;
