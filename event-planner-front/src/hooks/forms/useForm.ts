import { useEffect, useState } from "react";

import { IFormInputStatus, IServerError } from "../../types";

export const useForm = (
    sendFormData: (data: {
        [key: string]: IFormInputStatus;
    }) => Promise<IServerError>
) => {
    const [serverErrors, setServerErrors] = useState<IServerError>({});
    const [usedSubmit, setUsedSubmit] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);
    const [inputStatuses, setInputStatuses] = useState<{
        [key: string]: IFormInputStatus;
    }>({});
    const [hiddenInputStatuses, setHiddenInputStatuses] = useState<{
        [key: string]: IFormInputStatus;
    }>({});

    const getInputStatus = (name: string) => {
        if (name in inputStatuses) return inputStatuses[name];
    };

    const hideInputStatus = (name: string, hidden: boolean) => {
        if (hidden) {
            if (!(name in inputStatuses)) return;

            const newHidden = { ...hiddenInputStatuses };
            newHidden[name] = inputStatuses[name];
            const newStatuses = { ...inputStatuses };
            delete newStatuses[name];
            setHiddenInputStatuses(newHidden);
            setInputStatuses(newStatuses);
        } else {
            if (!(name in hiddenInputStatuses)) return;

            const newStatuses = { ...inputStatuses };
            newStatuses[name] = hiddenInputStatuses[name];
            const newHidden = { ...hiddenInputStatuses };
            delete newHidden[name];
            setHiddenInputStatuses(newHidden);
            setInputStatuses(newStatuses);
        }
    };
    const updateInputStatuses = (name: string, value: IFormInputStatus) =>
        setInputStatuses((currValue) => {
            const result = { ...currValue };
            result[name.toLowerCase()] = value;
            return result;
        });
    const [hasError, setErrors] = useState(false);

    const reset = () => {
        setSubmitted(false);
        setUsedSubmit(false);
    };

    const checkErrors = () => {
        let hasError = false;
        let isDirty = true;

        for (const key in inputStatuses) {
            const status = inputStatuses[key];

            if (status.hasError) hasError = true;

            if (!status.isDirty) isDirty = false;

            if (hasError && !isDirty) break;
        }

        if (serverErrors.message && isDirty) hasError = true;

        return hasError;
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        setErrors(checkErrors() && usedSubmit);
    }, [inputStatuses]);

    const onChange = () => setSubmitted(false);
    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const hasErrors = checkErrors();
        setErrors(hasErrors);
        setSubmitted(true);
        setUsedSubmit(true);
        setServerErrors({});
        console.log("submitted", hasErrors);
        if (!hasErrors && Object.keys(inputStatuses).length > 0) {
            const errors = await sendFormData(inputStatuses);
            console.log("sent");
            if (!errors) return;
            setServerErrors(errors);
            setErrors(true);
            for (const key in errors) {
                if (key !== "message")
                    inputStatuses[key.toLowerCase()].removeDirty();
            }
        }
    };

    return {
        serverErrors,
        isSubmitted,
        getInputStatus,
        hideInputStatus,
        updateInputStatuses,
        onChange,
        onSubmit,
        hasError,
        reset,
    };
};
