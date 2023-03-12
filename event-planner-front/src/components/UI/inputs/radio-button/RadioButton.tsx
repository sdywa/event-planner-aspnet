import React, { FC, useEffect } from "react";
import { IFormInputStatus } from "../../../../types";

interface IRadioButtonProps {
    id: string;
    name: string;
    value: string;
    children: React.ReactNode;
    defaultChecked: boolean;
    callBack: (name: string, value: IFormInputStatus) => void;
    [key: string]: any;
};

export const RadioButton: FC<IRadioButtonProps> = ({id, name, value, children, callBack, defaultChecked, ...props}) => {
    function update() {
        callBack(name, {
            name: name,
            value: value,
            removeDirty: () => {},
            hasError: false,
            isDirty: false,
            isActive: false
        });
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked)
            update();
    }

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (defaultChecked)
            update();
        }, []);

    return (
        <li className="flex gap-2 pb-5 group">
            <input type="radio" className="appearance-none cursor-pointer w-4 h-4 bg-white border-2 border-lightgray rounded-full translate-y-1 flex justify-center items-center
            group-hover:border-gray group-hover:before:bg-gray transition-colors duration-300
            before:content-[''] before:inline-block before:w-2 before:h-2 before:rounded-full before:bg-lightgray before:scale-0 before:transition-transform before:duration-100 checked:before:scale-100" name={name} id={id} value={value} onChange={onChange} defaultChecked={defaultChecked} {...props} />
            <label htmlFor={id} className="cursor-pointer group-hover:text-darkgray transition-colors duration-300">
                {children}
            </label>
        </li>
    );
}
