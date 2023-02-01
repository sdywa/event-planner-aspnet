import React, { useState } from "react";
import { IValidation } from "../../types";
import useValidation from "../useValidation";

function useFormInput<T extends HTMLInputElement | HTMLTextAreaElement>(initialValue: string, validations: IValidation[]) {
    const [value, setValue] = useState(initialValue);
    const [prevValue, setPrevValue] = useState(initialValue);
    
    const [isActive, setActive] = useState(false);
    const [isDirty, setDirty] = useState(false);

    const [showingError, setError] = useState(false);
    const error = useValidation(value, [...validations].sort((a, b) => a.order - b.order));

    const onChange = (e: React.ChangeEvent<T>) => {
        setValue(e.target.value);
        setError(false);
    }

    const onFocus = (e: React.FocusEvent<T>) => {
        setActive(true);
    }

    const onBlur = (e: React.FocusEvent<T>) => {
        setActive(false);
        setError(Boolean(error));
        if (value !== prevValue)
            setDirty(true);
        else
            setDirty(false);
    }

    const removeDirty = () => {
        setDirty(false);
        setError(true);
        setPrevValue(value);
    }

    return { value, onChange, onFocus, onBlur, isActive, isDirty, removeDirty, showingError, error };
}

export default useFormInput;
