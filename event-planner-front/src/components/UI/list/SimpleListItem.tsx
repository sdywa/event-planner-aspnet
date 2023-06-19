import React, { FC } from "react";

import { WithIcon } from "../WithIcon";

import { ListItem } from "./ListItem";

interface ISimpleListItemProps {
    label: React.ReactNode;
    link?: string;
    icon?: React.ReactNode;
    [x: string]: unknown;
}

export const SimpleListItem: FC<ISimpleListItemProps> = ({
    label,
    icon,
    link,
    ...props
}) => {
    return (
        <ListItem link={link} {...props}>
            <WithIcon icon={icon}>{label}</WithIcon>
        </ListItem>
    );
};
