import { ServerStreamFileResponseOptionsWithError } from "http2";
import { FC } from "react";
import "./Input.css";

interface IInputProps  {
    name: string;
    icon?: React.ReactNode;
    [props:string]: any;
};

export const Input: FC<IInputProps> = ({name, icon, ...props}) => {
    return (
        <div className="input-box">
            <input type="text" name={name} {...props}
                className={["input", icon ? "input-icon" : ""].filter(x => x).join(" ")}
            />
            <label htmlFor={name} className="input-label">
                {
                    icon
                    ?
                    <div className="label-icon">
                        {icon}
                    </div>
                    :
                    <></>
                }
            </label>
        </div>
    );
}
