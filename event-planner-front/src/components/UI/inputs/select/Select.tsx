import React, { FC, useState, useEffect } from "react";
import clsx from "clsx";
import { IFormInputStatus } from "../../../../types";
import { SelectOption } from "./SelectOption";

interface ISelectProps {
    name: string;
    defaultValue?: string;
    isFormSubmitted: boolean;
    options: {
        value: string;
        title: string;
    }[];
    callBack: (name: string, value: IFormInputStatus) => void;
};

export const Select: FC<ISelectProps> = ({name, options, callBack, isFormSubmitted, defaultValue=""}) => {

    // Проверяем, есть ли такое значение в options. Если нет, то берём его за базовое
    let initValue = "";
    let initTitle = "";
    let defaultTitle = "";
    if (defaultValue) {
        let defaultOption = options.findIndex((o) => o.value === defaultValue);
        if (defaultOption !== -1) {
            initValue = options[defaultOption].value;
            initTitle = options[defaultOption].title;
        } else {
            defaultTitle = defaultValue;
        }
    }

    const [value, setValue] = useState(initValue);
    const [title, setTitle] = useState(initTitle);

    const [hasError, setError] = useState(false);
    const [errorText, setErrorText] = useState("");

    const [isActive, setActive] = useState(false);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        update(value);
    }, [hasError,  title]);

    function update(value: string) {
        callBack(name, {
            name: name,
            value: value,
            removeDirty: () => {},
            hasError: hasError, 
            isDirty: false, 
            isActive: false
        });
    }

    function getClassName(classes: {default: string, active: string, error: string}) {
        const className = [classes.default];
        if (isActive) 
            className.push(classes.active);

        if (errorText)
            className.push(classes.error);

        if (className.length === 1)
            className.push("border-lightgray group-hover:border-gray after:border-t-lightgray hover:after:border-t-gray");

        return className.join(" ");
    }

    const optionCallback = (value: string) => {
        setError(false);
        setErrorText("");
        setValue(value);
        update(value);
        const option = options.find(o => o.value === value);
        if (option)
            setTitle(option.title);
        setActive(false);
    }

    function getError() {
        if (!value) {
            setError(true);
            return defaultTitle ? defaultTitle : "Выберите пункт";
        }
        return "";
    }

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setActive(!isActive);
    }

    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isActive) {
            setActive(false);
            setErrorText(getError());
        }
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */ 
        if (isFormSubmitted) {
            setErrorText(getError());
        }
    }, [isFormSubmitted]);

    return (
        <div>
            <div className="cursor-pointer relative text-base w-full h-9 group" onMouseLeave={onMouseLeave}>
                <div className={getClassName({
                    default: "select-base",
                    active: "select-base--active border-b-transparent group-hover:border-b-transparent rounded-b-none",
                    error: "select-base--error"
                })} onClick={onClick}>
                    {title || defaultTitle}
                </div>
                <ul className={clsx(getClassName({
                    default: "select-popup",
                    active: "select-popup--active",
                    error: "select-popup--error"
}               ), !isActive && "hidden")}>
                    {
                        options.map((o) => <SelectOption key={o.value} isActive={value === o.value} value={o.value} callBack={optionCallback}>{o.title}</SelectOption>)
                    }
                </ul>
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">{errorText}</div>
        </div>
    );
}
