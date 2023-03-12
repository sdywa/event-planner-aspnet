import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../..";
import { Button } from "../button/Button";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { Logo, LogoTypes } from "../logo/Logo";

const Header: FC = () => {
    const {user} = useContext(Context);
    const navigate = useNavigate();

    return (
        <header className="flex justify-center items-center">
            <div className="flex justify-between items-center h-[3.75rem] min-w-[48rem] max-w-6xl w-9/12">
                <Logo logoType={LogoTypes.COMPACT_LOGO} />
                {user.isAuth
                ?
                    <DropdownMenu items={[
                        {label: "Настройки", link: "/settings", icon: <i className="fa-solid fa-gear"></i>},
                        {label: "Выход", onClick: async () => { await user.logout(); navigate("/")}, icon: <i className="fa-solid fa-right-from-bracket"></i>}
                        ]}>
                            <Button>
                                <div className="flex justify-between items-center gap-2 text-lg py-2">
                                    <div>{user.user.name}</div>
                                    <i className="fa-solid fa-caret-down"></i>
                                </div>
                            </Button>
                        </DropdownMenu>
                :
                <div className="flex justify-between items-center gap-1">
                    <Button link="/login">Вход</Button>
                    <Button link="/signup" isPrimary={true}>Регистрация</Button>
                </div>
                }
            </div>
        </header>
    );
}

export default observer(Header);
