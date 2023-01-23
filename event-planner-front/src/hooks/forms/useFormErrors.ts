import { useState, useEffect } from "react";
import { IFieldStatus, IServerError } from "../../types";

const useFormErrors = (serverError: IServerError, statuses: {[key: string]: IFieldStatus}) => {
    const [hasErrors, setErrors] = useState(false);
    const [isDirty, setDirty] = useState(true);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        let hasErrors = false;
        let isDirty = true;
        
        for (const key in statuses) {
            const status = statuses[key];

            if (status.hasError)
                hasErrors = true;

            if (!status.isDirty)
                isDirty = false;

            if (hasErrors && !isDirty)
                break;
        }

        setErrors(hasErrors);
        setDirty(isDirty);
    }, [statuses]);

    return hasErrors || (Object.keys(serverError).length !== 0 && !isDirty);
}

export default useFormErrors;
