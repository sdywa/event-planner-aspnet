import { useEffect, useState } from "react";
import { IFormInputStatus, IServerError } from "../../types";

const useForm = (sendFormData: (data: {[key: string]: IFormInputStatus}) => IServerError) => {
    const [serverErrors, setServerErrors] = useState<IServerError>({});
    const [usedSubmit, setUsedSubmit] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);
    const [inputStatuses, setInputStatuses] = useState<{[key: string]: IFormInputStatus}>({});

    const updateFieldStatuses = (name: string, value: IFormInputStatus) => setInputStatuses((currValue) => {
        const result = {...currValue};
        result[name] = value;
        return result;
    });
    const [hasError, setErrors] = useState(false);

    const checkErrors = () => {
        let hasError = false;
        let isDirty = true;
        
        for (const key in inputStatuses) {
            const status = inputStatuses[key];

            if (status.hasError)
                hasError = true;

            if (!status.isDirty)
                isDirty = false;

            if (hasError && !isDirty)
                break;
        }
        return hasError;
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        setErrors(checkErrors() && usedSubmit);
    }, [inputStatuses]);

    const onChange = () => setSubmitted(false);
    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const hasErrors = checkErrors();
        setErrors(hasErrors);
        setSubmitted(true);
        setUsedSubmit(true);
        setServerErrors({});
        console.log("submitted", hasErrors);
        if (!hasErrors && Object.keys(inputStatuses).length > 0) {
            const errors = sendFormData(inputStatuses);
            console.log("sent");
            if (!errors)
                return; 
            setServerErrors(errors);
            for (const key in errors) {
                inputStatuses[key].removeDirty();
            }
        }
    }

    return {serverErrors, isSubmitted, updateFieldStatuses, onChange, onSubmit, hasError};
}

export default useForm;
