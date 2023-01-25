import { FC } from "react";
import { Button } from "../button/Button";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { Logo, LogoTypes } from "../logo/Logo";

export const Header: FC = () => {
    const isAuth = false;
    const username = "Username";

    return (
        <header className="flex justify-center items-center">
            <div className="flex justify-between items-center h-[3.75rem] min-w-[48rem] max-w-6xl w-9/12">
                <Logo logoType={LogoTypes.COMPACT_LOGO} />
                {isAuth
                ?
                    <DropdownMenu items={[
                        {label: "Настройки", link: "/account/settings", icon: <i className="fa-solid fa-gear"></i>}, 
                        {label: "Выход", link: "/logout", icon: <i className="fa-solid fa-right-from-bracket"></i>}
                        ]}>
                            <Button>
                                <div className="flex justify-between items-center gap-2 text-lg">
                                    <div>{username}</div>
                                    <i className="fa-solid fa-caret-down"></i>
                                </div>
                            </Button>
                        </DropdownMenu>
                :
                <div className="flex justify-between items-center gap-1">
                    <Button link="/login">Вход</Button>
                    <Button link="/signup" classes={["button--primary"]}>Регистрация</Button>
                </div>
                }
            </div>
        </header>
    );
}
