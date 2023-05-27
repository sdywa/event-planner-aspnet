import React, { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { IFormInputStatus } from "../../../types/index";

interface IDateTimeInputProps {
    initialValue?: string;
    name: string;
    isFormSubmitted: boolean;
    serverError: string;
    showError?: boolean;
    callBack: (name: string, value: IFormInputStatus) => void;
}

export const DateTimeInput: FC<IDateTimeInputProps> = ({
    initialValue = "",
    name,
    isFormSubmitted,
    serverError,
    showError = true,
    callBack,
}) => {
    const defaultClass =
        "border-2 rounded-md py-1 px-2 outline-none text-center transition-colors ease-in duration-150 cursor-pointer";
    const userTimezone = new Date().getTimezoneOffset() * 60 * 1000;

    const [date, setDate] = useState(-1);
    const [time, setTime] = useState(-1);
    const [prevDate, setPrevDate] = useState(-1);

    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    const [hasError, setError] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [isDirty, setDirty] = useState(false);
    const [isActive, setActive] = useState(false);

    const parsedDate = () => Date.parse(dateRef.current?.value || "");
    const parsedTime = () =>
        Date.parse(`01 Jan 1970 ${timeRef.current?.value} GMT`);
    const fullDate = () =>
        time !== -1 && date !== -1
            ? new Date(date + time + userTimezone).toISOString()
            : null;

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const resultDate = fullDate();
        callBack(name, {
            name: name,
            value: resultDate,
            removeDirty: resetInput,
            hasError: hasError,
            isDirty: isDirty,
            isActive: false,
        });
    }, [date, time, hasError, isDirty]);

    function getClassName() {
        const className = [defaultClass];
        if (isActive) className.push("input--active");

        if (errorText) className.push("input--error");

        if (className.length === 1) className.push("border-lightgray");

        return className.join(" ");
    }

    function getError(isDirty: boolean, isSubmitted: boolean) {
        const isDateUsed = date > -1 || isSubmitted;
        if (!dateRef.current?.value && isDateUsed) {
            setError(true);
            return "Введите дату";
        }

        const parsed = parsedDate();
        if (new Date(parsed) < new Date() && isDateUsed) {
            setError(true);
            return "Некорректная дата";
        }

        const isTimeUsed = (time && time !== -1) || isSubmitted;
        if (!timeRef.current?.value && isTimeUsed) {
            setError(true);
            return "Введите время";
        }

        if (!isDirty && serverError) {
            setError(true);
            return serverError;
        }
        return "";
    }

    useEffect(() => {
        setErrorText(getError(isDirty, false));
    }, [serverError]);

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setActive(true);
        e.target.showPicker();
    };

    const onChange = () => {
        setError(false);
        setErrorText("");
    };

    const onBlur = () => {
        setActive(false);

        const newDate = parsedDate();
        const isDirty = newDate !== prevDate;
        setDirty(isDirty);
        setDate(!isNaN(newDate) ? newDate : 0);

        const newTime = parsedTime();
        if (!isNaN(newTime)) setTime(newTime);

        const errors = getError(isDirty, false);
        setErrorText(errors);
    };

    const resetInput = () => {
        setDirty(false);
        setErrorText(getError(false, false));
        setPrevDate(date);
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (isFormSubmitted) setErrorText(getError(false, true));
    }, [isFormSubmitted]);

    useEffect(() => {
        let initialDate = -1;
        let initialTime = -1;
        if (initialValue) {
            const parsed = Date.parse(initialValue);
            if (!isNaN(parsed)) {
                const fullDate = new Date(parsed);
                const date = new Date(
                    fullDate.getFullYear(),
                    fullDate.getMonth(),
                    fullDate.getDate()
                ).getTime();
                const time = new Date(parsed - date).getTime();
                initialDate = date - userTimezone;
                initialTime = time;
            }
        }
        if (
            !dateRef.current ||
            !timeRef.current ||
            initialDate === -1 ||
            initialTime === -1
        ) {
            setError(true);
            return;
        }
        setPrevDate(date);
        setDate(initialDate);
        setTime(initialTime);
        dateRef.current.value = new Date(initialDate)
            .toISOString()
            .split("T")[0];
        timeRef.current.value = new Date(initialTime)
            .toISOString()
            .split("T")[1]
            ?.split(".")[0];
        setError(false);
    }, [initialValue]);

    return (
        <div>
            <div className="flex items-center gap-4 font-roboto text-sm">
                <input
                    type="date"
                    className={clsx("w-32", getClassName())}
                    ref={dateRef}
                    onFocus={onFocus}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                <input
                    type="time"
                    className={clsx("w-24", getClassName())}
                    ref={timeRef}
                    onFocus={onFocus}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            </div>
            {showError && (
                <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">
                    {errorText}
                </div>
            )}
        </div>
    );
};
