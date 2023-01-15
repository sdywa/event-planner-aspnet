import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button/Button";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import "./Header.css";

export const Header: FC = () => {
    const isAuth = true;
    const username = "Username";

    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-logo" onClick={() => navigate("/")}>
                    <img className="header-logo-inner" src={require("../../../assets/img/logo/compact-logo.svg").default} alt="Логотип" />
                </div>
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
