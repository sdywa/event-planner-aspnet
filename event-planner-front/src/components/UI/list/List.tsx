import React, { FC } from "react";

interface IListProps {
    children: React.ReactNode;
    [key: string]: unknown;
}

export const List: FC<IListProps> = ({ children, ...props }) => {
    return <ul {...props}>{children}</ul>;
};
