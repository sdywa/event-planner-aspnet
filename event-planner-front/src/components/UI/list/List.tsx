import { FC } from "react";

interface IListProps {
    children: React.ReactNode;
    [key:string]: any;
};

export const List: FC<IListProps> = ({children, ...props}) => {
    return (
        <ul {...props}>
            {children}
        </ul>
    );
}
