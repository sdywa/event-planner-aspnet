import { useState, useEffect } from "react";
import { IFieldStatus, IServerError } from "../types";

const useErrors = (serverError: IServerError, statuses: {[key: string]: IFieldStatus}) => {
    const [hasErrors, setErrors] = useState(false);
    const [isDirty, setDirty] = useState(true);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        setErrors(false);
        setDirty(true);
        for (const key in statuses) {
            const status = statuses[key];

            if (status.hasError)
                setErrors(true);

            if (!status.isDirty)
                setDirty(false);

            if (hasErrors && !isDirty)
                break;
        }
    }, [statuses]);
    return hasErrors || (Object.keys(serverError).length !== 0 && !isDirty);
}

export default useErrors;
