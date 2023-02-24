import { FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./UI/header/Header";

interface ILayoutProps {
    hideHeaderPath: string[];
};

export const Layout: FC<ILayoutProps> = ({hideHeaderPath}) => {
    const location = useLocation();

    return (
        <>
            {!hideHeaderPath.includes(location.pathname) && <Header /> }
            <Outlet />
        </>
    );
}
