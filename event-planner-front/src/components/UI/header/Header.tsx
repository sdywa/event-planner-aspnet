import React, { FC } from "react";
import { Button } from "../button/Button";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { Logo, LogoTypes } from "../logo/Logo";
import "./Header.css";

export const Header: FC = () => {
    const isAuth = false;
    const username = "Username";

    return (
        <header className="header">
            <div className="header-inner">
                <Logo logoType={LogoTypes.COMPACT_LOGO} />
                {isAuth
                ?
                    <DropdownMenu items={[
                        {label: "Настройки", link: "/account/settings", icon: "fa-solid fa-gear"}, 
                        {label: "Выход", link: "/logout", icon: "fa-solid fa-right-from-bracket"}
                        ]}>
                            <Button>
                                <div className="controls-inner controls--authenticated">
                                    <div className="controls-username">{username}</div>
                                    <div className="controls-indicator">
                                        <i className="fa-solid fa-caret-down"></i>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenu>
                :
                <div className="controls-inner controls--unauthenticated">
                    <Button link="/login">Вход</Button>
                    <Button link="/signup" classes={["button--primary"]}>Регистрация</Button>
                </div>
                }
            </div>
        </header>
    );
}
