import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";

import { IFormInputStatus } from "../../../../types";

import { SelectOption } from "./SelectOption";

interface ISelectProps {
    name: string;
    defaultValue?: unknown;
    isFormSubmitted: boolean;
    serverError: string;
    options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any;
        title: string;
    }[];
    callBack: (name: string, value: IFormInputStatus) => void;
}

export const Select: FC<ISelectProps> = ({
    name,
    options,
    callBack,
    isFormSubmitted,
    serverError,
    defaultValue = null,
}) => {
    // Проверяем, есть ли такое значение в options. Если нет, то берём его за базовое
    const [defaultTitle, setDefaultTitle] = useState("");
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("");
    const [prevValue, setPrevValue] = useState("");

    const [hasError, setError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [isDirty, setDirty] = useState(false);
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        update(value);
    }, [hasError, title]);

    function update(value: string) {
        callBack(name, {
            name: name,
            value: value,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            removeDirty: () => {},
            hasError: hasError,
            isDirty: isDirty,
            isActive: false,
        });
    }

    function getClassName(classes: {
        default: string;
        active: string;
        error: string;
    }) {
        const className = [classes.default];
        if (isActive) className.push(classes.active);

        if (errorText) className.push(classes.error);

        if (className.length === 1)
            className.push(
                "border-lightgray group-hover:border-gray after:border-t-lightgray hover:after:border-t-gray"
            );

        return className.join(" ");
    }

    const optionCallback = (value: string) => {
        setError(false);
        setValue(value);
        const isDirty = value !== prevValue;
        setDirty(isDirty);
        setErrorText(getError(value, isDirty));
        const option = options.find((o) => o.value === value);
        if (option) setTitle(option.title);
        setActive(false);
    };

    function getError(value: string, isDirty: boolean) {
        if (value === "") {
            setError(true);
            return defaultTitle ? defaultTitle : "Выберите пункт";
        }
        if (!isDirty && serverError) {
            setError(true);
            return serverError;
        }
        return "";
    }

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setActive(!isActive);
    };

    const onMouseLeave = () => {
        if (isActive) {
            setActive(false);
            const isDirty = value !== prevValue;
            setDirty(isDirty);
            setErrorText(getError(value, isDirty));
        }
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (isFormSubmitted) {
            setErrorText(getError(value, false));
            setPrevValue(value);
        }
    }, [isFormSubmitted]);

    useEffect(() => {
        let value = "";
        let title = "";
        let defaultTitle = "";
        if (defaultValue != null) {
            const defaultOption = options.findIndex(
                (o) => o.value === defaultValue
            );
            if (defaultOption !== -1) {
                value = options[defaultOption].value;
                title = options[defaultOption].title;
            } else {
                defaultTitle = defaultValue as string;
            }
        }
        setValue(value);
        setTitle(title);
        setDefaultTitle(defaultTitle);
    }, [defaultValue]);

    return (
        <div>
            <div
                className="cursor-pointer relative text-base w-full h-9 group"
                onMouseLeave={onMouseLeave}
            >
                <div
                    className={getClassName({
                        default: "select-base",
                        active: "select-base--active border-b-transparent group-hover:border-b-transparent rounded-b-none",
                        error: "select-base--error",
                    })}
                    onClick={onClick}
                >
                    {title || defaultTitle}
                </div>
                <ul
                    className={clsx(
                        getClassName({
                            default: "select-popup",
                            active: "select-popup--active",
                            error: "select-popup--error",
                        }),
                        !isActive && "hidden"
                    )}
                >
                    {options.map((o) => (
                        <SelectOption
                            key={o.value}
                            isActive={value === o.value}
                            value={o.value}
                            callBack={optionCallback}
                        >
                            {o.title}
                        </SelectOption>
                    ))}
                </ul>
            </div>
            <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">
                {errorText}
            </div>
        </div>
    );
};
