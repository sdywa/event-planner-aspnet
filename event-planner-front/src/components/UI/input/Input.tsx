import { ServerStreamFileResponseOptionsWithError } from "http2";
import { FC } from "react";
import "./Input.css";

interface IInputProps  {
    name: string;
    [props:string]: any;
};

export const Input: FC<IInputProps> = ({name, ...props}) => {
    return (
        <div className="input-box">
            <input type="text" name={name} {...props}
                className="input"
            />
            <label htmlFor={name} className="input-label"></label>
        </div>
    );
}
