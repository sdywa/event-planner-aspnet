import { FC } from "react";

interface IRadioButtonProps {
    id: string;
    name: string;
    value: string;
    children: React.ReactNode;
    [key: string]: any;
};

export const RadioButton: FC<IRadioButtonProps> = ({id, name, value, children, ...props}) => {
    return (
        <li className="flex gap-2 pb-5 group">
            <input type="radio" className="appearance-none cursor-pointer w-4 h-4 bg-white border-2 border-lightgray rounded-full translate-y-1 flex justify-center items-center
            group-hover:border-gray group-hover:before:bg-gray transition-colors duration-300
            before:content-[''] before:inline-block before:w-2 before:h-2 before:rounded-full before:bg-lightgray before:scale-0 before:transition-transform before:duration-100 checked:before:scale-100" name={name} id={id} value={value} {...props} />
            <label htmlFor={id} className="cursor-pointer group-hover:text-darkgray transition-colors duration-300">
                {children}
            </label>
        </li>
    );
}
