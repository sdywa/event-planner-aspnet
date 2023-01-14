import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button/Button";
import { PrimaryButton } from "../button/PrimaryButton";
import './Header.css';

export const Header: FC = () => {
    const isAuth = false;
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-inner">
                <div className="header-logo" onClick={() => navigate('/')}>
                    <img className="header-logo-inner" src={ require('../../../assets/img/logo/compact-logo.svg').default } alt="Логотип" />
                </div>
                {isAuth
                ?
                    <div className="header-controls header-controls--authenticated">
                        <div className="header-username">username</div>
                        <div className="popup-indicator">
                            <i className="fa-solid fa-caret-down"></i>
                        </div>
                    </div>
                :
                <div className="header-controls header-controls--unauthenticated">
                    <Button link="/login">Вход</Button>
                    <PrimaryButton link="/signup">Регистрация</PrimaryButton>
                </div>
                }
            </div>
        </header>
    );
}
