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
                    <li key={link} className={clsx(["switcher-tab group", activeTab === title && "switcher-tab--selected"])}>
                        <Button link={link} className={"switcher-tab-button group-[.switcher-tab--selected]:border-green py-2"}>
                            <span className="text-lg group-[.switcher-tab--selected]:text-green">{title}</span>
                        </Button>
                    </li>
                )
            }
        </ul>
    );
}
