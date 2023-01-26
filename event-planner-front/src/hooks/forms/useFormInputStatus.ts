import { useEffect } from "react";
import { IFormInputData, IFieldStatus } from "../../types";
import useFormInput from "./useFormInput";

const useFormInputStatus = (
    name: string,
    data: IFormInputData,
    callBack: (name: string, value: IFieldStatus) => void) => {
    const {error, isDirty, isActive, removeDirty, ...props} = useFormInput("", data.validation);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        callBack(name, {
            name: name,
            value: props.value,
            hasError: Boolean(error),
            isActive: isActive,
            isDirty: isDirty,
            removeDirty: removeDirty
        });
    }, [error, isDirty, isActive, props.value]);

    return {error, isDirty, isActive, ...data, ...props};
}

export default useFormInputStatus;