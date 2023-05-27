import React, { FC, useEffect } from "react";
import clsx from "clsx";

import { useFormInput } from "../../../hooks/forms/useFormInput";
import { IFormInputData, IFormInputStatus } from "../../../types";
import { Input } from "../inputs/Input";

interface IFormInputProps {
    initialValue?: string;
    className?: string | string[];
    name: string;
    data: IFormInputData;
    serverError: string;
    isSubmitted: boolean;
    showError?: boolean;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: unknown;
}

export const FormInput: FC<IFormInputProps> = ({
    initialValue = "",
    name,
    data,
    serverError,
    isSubmitted,
    className,
    showError = true,
    callBack,
    ...props
}) => {
    const { value, setValue, errorText, getClassName, ...inputData } =
        useFormInput<HTMLInputElement>(
            initialValue,
            name,
            data.validation,
            isSubmitted,
            serverError,
            {
                default: data.label ? "pt-6" : "",
                active: "input--active",
                dirty: "input--dirty",
                error: "input--error",
            },
            callBack
        );

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        setValue(initialValue);
    }, [initialValue]);

    return (
        <div className="w-full">
            <Input
                type={data.type}
                name={name}
                autoComplete={data.autoComplete}
                {...props}
                value={value}
                {...inputData}
                className={clsx(
                    getClassName(),
                    className,
                    showError && "warning"
                )}
            >
                {data.label && (
                    <span className="label-content absolute bottom-0 left-1.5 pb-1 transition-all duration-300 ease-in">
                        {data.label}
                    </span>
                )}
            </Input>
            {showError && (
                <div className="text-red font-roboto font-bold text-xs h-6 pt-1 pb-2">
                    {errorText}
                </div>
            )}
        </div>
    );
};
