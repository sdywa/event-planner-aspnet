import { FC } from "react";

interface IWithIconProps {
    children: React.ReactNode;
    icon: React.ReactNode;
};

export const WithIcon: FC<IWithIconProps> = ({children, icon}) => {
    return (
        <div className="flex justify-center items-center gap-2">
            {icon}
            {children}
        </div>
    );
}
