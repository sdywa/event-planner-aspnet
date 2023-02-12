import React, { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { IFormInputStatus } from "../../../types/index";

interface IDateTimeInputProps {
    name: string;
    serverError: string;
    callBack: (name: string, value: IFormInputStatus) => void;
};

export const DateTimeInput: FC<IDateTimeInputProps> = ({name, callBack}) => {
    const defaultClass = "border-2 rounded-md py-1 px-2 outline-none text-center transition-colors ease-in duration-150";
    const [date, setDate] = useState(-1);
    const [time, setTime] = useState(-1);

    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    const [hasError, setError] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [isDirty, setDirty] = useState(false);
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        callBack(name, {
            name: name,
            value: new Date(date + time).toISOString(),
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

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setActive(true);
        e.target.showPicker();
    }

    const onChange = (e: React.ChangeEvent) => {
        setError(false);
        setErrorText("");
    }

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setActive(false);
        setDirty(true);
        console.log(dateRef.current?.value, date, time);
        if (date !== -1 && !dateRef.current?.value) {
            setErrorText("Введите дату");
            setError(true);
            return;
        }
        
        const parsed = Date.parse(dateRef.current?.value || "");
        if (new Date(parsed) > new Date()) {
            setDate(parsed);
        } else if (date !== -1) {
            setErrorText("Дата должна быть не менее завтра");
            setError(true);
            return;
        }

        if (timeRef.current?.value) {
            setTime(Date.parse(`01 Jan 1970 ${timeRef.current?.value} GMT`));
        } else if ((time !== -1)) {
            console.log(!timeRef.current?.value)
            setErrorText("Введите время");
            setError(true);
            return;
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 font-roboto text-sm">
                <input type="date" className={clsx("w-32", getClassName())} ref={dateRef} onFocus={onFocus} onChange={onChange} onBlur={onBlur} />
                <input type="time" className={clsx("w-24", getClassName())} ref={timeRef} onFocus={onFocus} onChange={onChange} onBlur={onBlur}/>
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{errorText}</div>
        </div>
    );
}
