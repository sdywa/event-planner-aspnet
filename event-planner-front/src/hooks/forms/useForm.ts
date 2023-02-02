import { useState, useEffect } from "react";
import { IFormInputStatus, IServerError } from "../../types";

const useForm = (sendFormData: (data: {[key: string]: IFormInputStatus}) => IServerError) => {
    const [serverErrors, setServerErrors] = useState<IServerError>({});
    const [isSubmitted, setSubmitted] = useState(false);
    const [fieldStatuses, setFieldStatuses] = useState<{[key: string]: IFormInputStatus}>({});

    const updateFieldStatuses = (name: string, value: IFormInputStatus) => setFieldStatuses((currValue) => {
        const result = {...currValue};
        result[name] = value;
        return result;
    });
    const [hasError, setErrors] = useState(false);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        let hasError = false;
        let isDirty = true;
        
        for (const key in fieldStatuses) {
            const status = fieldStatuses[key];

            if (status.hasError)
                hasError = true;

            if (!status.isDirty)
                isDirty = false;

            if (hasError && !isDirty)
                break;
        }

        // Если есть ошибка в поле, либо от сервера были получены ошибки и форма не была изменена
        const shouldShowError = hasError || (Object.keys(serverErrors).length !== 0 && !isDirty);
        setErrors(shouldShowError && isSubmitted);
    }, [fieldStatuses]);

    const onChange = () => setSubmitted(false);
    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();             
        setSubmitted(true);
        setServerErrors({});
        if (!hasError) {
            const errors = sendFormData(fieldStatuses);
            if (!errors)
                return; 
            setServerErrors(errors);
            for (const key in errors) {
                fieldStatuses[key].removeDirty();
            }
        }
    }

    return {serverErrors, isSubmitted, updateFieldStatuses, onChange, onSubmit, hasError};
}

export default useForm;
