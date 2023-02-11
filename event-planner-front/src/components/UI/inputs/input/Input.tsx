import React, { FC, ReactNode } from "react";
import { clsx } from "clsx";

export enum InputStyle {
    CLASSIC,
    WITH_ICON
}

interface IInputProps  {
    type: string;
    name: string;
    className?: string | string[];
    children: ReactNode;
    style?: InputStyle;
    [props:string]: any;
};

export const Input: FC<IInputProps> = ({type, name, className, children, style=InputStyle.CLASSIC, ...props}) => {
    const renders = {
        [InputStyle.CLASSIC]: (node: ReactNode) => node,
        [InputStyle.WITH_ICON]: (node: ReactNode) => {
            return (
                <div className="absolute top-1/2 left-1.5 -translate-y-1/2 pt-0.5">
                    {node}
                </div>
            )
        }
    }

    return (
        <div className="input-box">
            <input className={clsx(["input", className])} type={type} name={name} {...props}/>
            <label htmlFor={name} className="input-label">
                {
                    renders[style](children)
                }
            </label>
        </div>
    );
}
