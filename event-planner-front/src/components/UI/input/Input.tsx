import React, { FC } from "react";
import "./Input.css";

interface IInputProps  {
    type: string;
    label: string;
    name: string;
    isDirty: boolean;
    isSubmitted?: boolean;
    error?: string;
    [props:string]: any;
};

export const Input: FC<IInputProps> = ({type, label, name, isDirty, error, value, isSubmitted=false, ...props}) => {
    function shouldShowError() {
        return error && (isDirty || isSubmitted);
    }

    return (
        <div className="input-box">
            <div className="input-box-inner">
                <input type={type} name={name} value={value} {...props}
                    className={
                        [`${type}-input`, isDirty && value ? 'dirty' : '', shouldShowError() ? 'input-error' : '']
                        .filter((x) => x)
                        .join(" ")}
                />
                <label htmlFor={name} className={`${type}-input-label`}>
                    <span className="label-content">{label}</span>
                </label>
            </div>
            <div className="error-text">{shouldShowError() && error}</div>
        </div>
    );
}
