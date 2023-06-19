import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { useUser } from "../../hooks/useUserContext";

import { Button } from "./buttons/Button";
import { DropdownMenu } from "./DropdownMenu";
import { Logo, LogoTypes } from "./Logo";

export const Header: FC = observer(() => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="flex justify-center items-center">
            <div className="flex justify-between items-center h-[3.75rem] min-w-[48rem] max-w-6xl w-9/12">
                <Logo logoType={LogoTypes.COMPACT_LOGO} />
                {user.isAuth ? (
                    <DropdownMenu
                        items={[
                            {
                                label: "Настройки",
                                link: "/user/settings",
                                icon: <i className="fa-solid fa-gear"></i>,
                            },
                            {
                                label: "История",
                                link: "/user/history",
                                icon: (
                                    <i className="fa-solid fa-book-open text-sm"></i>
                                ),
                            },
                            {
                                label: "Обращения",
                                link: "/user/chats",
                                icon: (
                                    <i className="fa-solid fa-comments text-sm"></i>
                                ),
                            },
                            {
                                label: "Выход",
                                onClick: async () => {
                                    await user.logout();
                                    console.log(location.pathname);

                                    location.pathname === "/"
                                        ? window.location.reload()
                                        : navigate("/");
                                },
                                icon: (
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                ),
                                className: "hover:text-red",
                            },
                        ]}
                    >
                        <Button>
                            <div className="flex justify-between items-center gap-2 text-lg py-2">
                                <div>{user.user.name}</div>
                                <i className="fa-solid fa-caret-down"></i>
                            </div>
                        </Button>
                    </DropdownMenu>
                ) : (
                    <div className="flex justify-between items-center gap-1">
                        <Button link="/login">Вход</Button>
                        <Button link="/signup" isPrimary={true}>
                            Регистрация
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
});
