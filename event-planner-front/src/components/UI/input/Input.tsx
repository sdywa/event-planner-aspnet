import { FC } from "react";
import "./Input.css";

interface IInputProps  {
    type: string;
    label: string;
    name: string;
    isActive: boolean;
    isDirty: boolean;
    error?: string;
    [props:string]: any;
};

export const Input: FC<IInputProps> = ({type, label, name, isActive, isDirty, error, value, ...props}) => {
    function getClassName() {
        const className = ["input"];
        if (isActive) 
            className.push("input--active");

        if (isDirty && value)
            className.push("input--dirty");
        
        if (error)
            className.push("input--error");

        return className.join(" ");
    }

    return (
        <div className="input-box-inner">
            <input type={type} name={name} value={value} {...props}
                className={getClassName()}
            />
            <label htmlFor={name} className="input-label">
                <span className="label-content">{label}</span>
            </label>
        </div>
    );
}
