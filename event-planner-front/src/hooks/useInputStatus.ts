import { useEffect } from "react";
import { IFormInputData, IFieldStatus } from "../types";
import useInput from "./useInput";

const useInputStatus = (
    name: string,
    data: IFormInputData,
    callBack: (name: string, value: IFieldStatus) => void) => {
    const {error, isDirty, removeDirty, ...props} = useInput("", data.validation);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        callBack(name, {
            name: name,
            value: props.value,
            hasError: Boolean(error),
            isDirty: isDirty,
            removeDirty: removeDirty
        });
    }, [error, isDirty, props.value]);

    return {error, isDirty, ...data, ...props};
}

export default useInputStatus;
