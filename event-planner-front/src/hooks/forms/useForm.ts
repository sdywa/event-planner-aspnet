import { useState } from "react";
import useFormErrors from "../../hooks/forms/useFormErrors";
import { IFieldStatus, IServerError } from "../../types";

const useForm = (sendFormData: (data: {[key: string]: IFieldStatus}) => IServerError) => {
    const [serverErrors, setServerErrors] = useState<IServerError>({});
    const [isSubmitted, setSubmitted] = useState(false);
    const [fieldStatuses, setFieldStatuses] = useState<{[key: string]: IFieldStatus}>({});
    const hasError = useFormErrors(serverErrors, fieldStatuses);
    const updateFieldStatuses = (name: string, value: IFieldStatus) => setFieldStatuses((currValue) => {
        const result = {...currValue};
        result[name] = value;
        return result;
    });

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

    return {serverErrors, isSubmitted, updateFieldStatuses, onChange, onSubmit, hasError: hasError && isSubmitted};
}

export default useForm;
