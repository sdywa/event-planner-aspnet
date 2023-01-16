import { FC } from "react";
import { Button } from "../button/Button";
import "./LinkSwitcher.css";

interface ILinkSwitcherProps {
    tabs: { title: string, link: string }[];
    activeTab: string;
};

export const LinkSwitcher: FC<ILinkSwitcherProps> = ({tabs, activeTab}) => {
    return (
        <ul className="link-switcher">
            {
                tabs.map(({title, link}) => 
                    <li className={["switcher-tab", activeTab === title ? "switcher-tab--selected" : ""].join(" ")}>
                        <Button link={link} classes={["switcher-tab-button"]}>{title}</Button>
                    </li>
                )
            }
        </ul>
    );
}