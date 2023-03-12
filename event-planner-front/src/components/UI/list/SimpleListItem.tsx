import { FC } from "react";
import { ListItem } from "./ListItem";
import { WithIcon } from "../with-icon/WithIcon";

interface ISimpleListItemProps {
    label: React.ReactNode;
    link?: string;
    icon?: React.ReactNode;
    [x:string]: any;
};

export const SimpleListItem: FC<ISimpleListItemProps> = ({label, icon, link, ...props}) => {
    return (
        <ListItem link={link} {...props}>
            <WithIcon icon={icon}>
                {label}
            </WithIcon>
        </ListItem>
    );
}
