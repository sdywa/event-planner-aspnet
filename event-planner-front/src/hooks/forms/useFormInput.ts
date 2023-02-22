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

    const [hasError, setError] = useState(true);
    const [errorText, setErrorText] = useState("");
    const validationError = useValidation(value, [...validations].sort((a, b) => a.order - b.order));

    const getError = (isDirty: Boolean) => {
        let error = "";
        if (validationError)
            error = validationError;
        else if (!isDirty)
            error = serverError;
        setError(Boolean(error));
        return error;
    }

    function update() {
        callBack(inputName, {
            name: inputName,
            value: value,
            removeDirty: resetInput,
            hasError, 
            isDirty, 
            isActive
        });
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        update();
    }, [hasError, isDirty, isActive, value]);

    useEffect(() => {
        if (isFormSubmitted)
            setErrorText(getError(false));
    }, [isFormSubmitted]);

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
        setErrorText("");
    }

    const onFocus = (e: React.FocusEvent<T>) => {
        setActive(true);
    }

    const onBlur = (e: React.FocusEvent<T>) => {
        setActive(false);
        const isDirty = value !== prevValue;
        setDirty(isDirty);
        setErrorText(getError(isDirty));
    }

    const resetInput = () => {
        setDirty(false);
        setErrorText(getError(false));
        setPrevValue(value);
    }

    const set = (newValue: string) => {
        setValue(newValue);
        setError(!Boolean(newValue));
    }

    return { 
        value, setValue: set, errorText, onChange, onFocus, onBlur, getClassName
    };
}

export default useFormInput;
