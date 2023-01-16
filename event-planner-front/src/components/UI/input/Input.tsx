import React, { FC } from "react";
import "./Input.css";

interface IInputProps  {
    type: string;
    label: string;
    name: string;
    [props:string]: any;
};

export const Input: FC<IInputProps> = ({type, label, name, ...props}) => {
    return (
        <div className="input-box">
            <input type={type} name={name} className={`${type}-input`} {...props} />
            <label htmlFor={name} className={`${type}-input-label`}>
                <span className="label-content">{label}</span>
            </label>
        </div>    
    );
}
