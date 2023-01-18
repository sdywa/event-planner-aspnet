import React, { useState } from "react";
import { IValidation } from "../types";
import useValidation from "./useValidation";

const useInput = (initialValue: string, validations: IValidation[]) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const error = useValidation(value, [...validations].sort((a, b) => a.order - b.order));

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setDirty(true);
    }

    const removeDirty = () => {
        setDirty(false);
    }

    return { value, onChange, onBlur, isDirty, removeDirty, error };
}

export default useInput;