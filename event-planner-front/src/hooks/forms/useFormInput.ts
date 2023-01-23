import React, { useState } from "react";
import { IValidation } from "../../types";
import useValidation from "../useValidation";

const useFormInput = (initialValue: string, validations: IValidation[]) => {
    const [value, setValue] = useState(initialValue);
    const [prevValue, setPrevValue] = useState(initialValue);
    
    const [isActive, setActive] = useState(false);
    const [isDirty, setDirty] = useState(false);

    const [showingError, setError] = useState(false);
    const error = useValidation(value, [...validations].sort((a, b) => a.order - b.order));

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(false);
    }

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setActive(true);
    }

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
