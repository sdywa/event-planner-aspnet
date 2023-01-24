import { FC } from "react";

interface IInputProps  {
    name: string;
    icon?: React.ReactNode;
    [props:string]: any;
};

export const Input: FC<IInputProps> = ({name, icon, ...props}) => {
    return (
        <div className="input-box">
            <input className={["input", icon ? "pl-8" : ""].filter(x => x).join(" ")} type="text" name={name} {...props}/>
            <label htmlFor={name} className="input-label">
                {
                    icon &&
                    <div className="absolute top-1/2 left-1.5 -translate-y-1/2 pt-0.5">
                        {icon}
                    </div>
                }
            </label>
        </div>
    );
}
