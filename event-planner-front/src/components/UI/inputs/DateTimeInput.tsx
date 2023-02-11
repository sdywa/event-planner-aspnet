import React, { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { IFormInputStatus } from "../../../types/index";

interface IDateTimeInputProps {
    name: string;
    serverError: string;
    callBack: (name: string, value: IFormInputStatus) => void;
};

export const DateTimeInput: FC<IDateTimeInputProps> = ({name, callBack}) => {
    const className = "border-2 rounded-md py-1 px-2 outline-none text-center transition-colors ease-in duration-150 focus:border-green";
    const [date, setDate] = useState(-1);
    const [time, setTime] = useState(-1);

    const dateRef = useRef<HTMLInputElement>(null);
    const timeRef = useRef<HTMLInputElement>(null);

    const [hasError, setError] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [isDirty, setDirty] = useState(false);

    useEffect(() => {
        console.log(new Date(date + time).toISOString());
        callBack(name, {
            name: name,
            value: new Date(date + time).toISOString(),
            removeDirty: () => {},
            hasError: hasError, 
            isDirty: isDirty, 
            isActive: false
        });
    }, [date, time, hasError, isDirty])

    const onChange = (e: React.ChangeEvent) => {
        setError(false);
        setErrorText("");
    }

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setDirty(true);
        console.log(dateRef.current?.value, date, time);
        if ((date !== -1 && time !== -1) && !dateRef.current?.value) {
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
        } else if ((date !== -1 && time !== -1)) {
            console.log(!timeRef.current?.value)
            setErrorText("Введите время");
            setError(true);
            return;
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 font-roboto text-sm">
                <input type="date" className={clsx("w-32", className, errorText ? "input--error" : "border-gray")} ref={dateRef} onFocus={(e) => e.target.showPicker()} onChange={onChange} onBlur={onBlur} />
                <input type="time" className={clsx("w-24", className, errorText ? "input--error" : "border-gray")} ref={timeRef} onFocus={(e) => e.target.showPicker()} onChange={onChange} onBlur={onBlur} />
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{errorText}</div>
        </div>
    );
}
