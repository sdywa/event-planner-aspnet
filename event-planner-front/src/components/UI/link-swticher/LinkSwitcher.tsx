import { FC } from "react";
import { clsx } from "clsx";
import { Button } from "../button/Button";

interface ILinkSwitcherProps {
    tabs: { title: string, link: string }[];
    activeTab: string;
};

export const LinkSwitcher: FC<ILinkSwitcherProps> = ({tabs, activeTab}) => {
    return (
        <ul className="flex justify-center items-center">
            {
                tabs.map(({title, link}) => 
                    <li key={link} className={clsx(["switcher-tab", activeTab === title && "switcher-tab--selected"])}>
                        <Button link={link} classes={["switcher-tab-button"]}>{title}</Button>
                    </li>
                )
            }
        </ul>
    );
}
