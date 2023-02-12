import React, { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { IFormInputStatus } from "../../../types/index";

interface IDateTimeInputProps {
    name: string;
    isFormSubmitted: boolean;
    serverError: string;
    callBack: (name: string, value: IFormInputStatus) => void;
};

export const DateTimeInput: FC<IDateTimeInputProps> = ({name, isFormSubmitted, callBack}) => {
    const defaultClass = "border-2 rounded-md py-1 px-2 outline-none text-center transition-colors ease-in duration-150 cursor-pointer";
    const [date, setDate] = useState(-1);
    const [time, setTime] = useState(-1);

    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    const [hasError, setError] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [isDirty, setDirty] = useState(false);
    const [isActive, setActive] = useState(false);

    const parsedDate = () => Date.parse(dateRef.current?.value || "");
    const parsedTime = () => Date.parse(`01 Jan 1970 ${timeRef.current?.value} GMT`);
    const fullDate = () => time && time !== -1 && date && date !== -1 ? new Date(date + time).toISOString() : null;

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const resultDate = fullDate();
        if (!resultDate)
            return;

        callBack(name, {
            name: name,
            value: resultDate,
            removeDirty: () => {},
            hasError: hasError, 
            isDirty: isDirty, 
            isActive: false
        });
    }, [date, time, hasError, isDirty]);

    function getClassName() {
        const className = [defaultClass];
        if (isActive) 
            className.push("input--active");
        
        if (errorText)
            className.push("input--error");

        if (className.length === 1)
            className.push("border-lightgray");

        return className.join(" ");
    }

    function getError(isSubmitted: boolean) {
        const isDateUsed = (date && date !== -1) || isSubmitted;
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
        return "";
    }

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setActive(true);
        e.target.showPicker();
    };

    const onChange = (e: React.ChangeEvent) => {
        setError(false);
        setErrorText("");
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setActive(false);
        setDirty(true);
        const errors = getError(false);
        setErrorText(errors);

        if (!errors) {
            setDate(parsedDate());
            setTime(parsedTime());
        }
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (isFormSubmitted)
            setErrorText(getError(true));
    }, [isFormSubmitted]);

    return (
        <div>
            <div className="flex items-center gap-4 font-roboto text-sm">
                <input type="date" className={clsx("w-32", getClassName())} ref={dateRef} onFocus={onFocus} onChange={onChange} onBlur={onBlur} />
                <input type="time" className={clsx("w-24", getClassName())} ref={timeRef} onFocus={onFocus} onChange={onChange} onBlur={onBlur} />
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{errorText}</div>
        </div>
    );
}
