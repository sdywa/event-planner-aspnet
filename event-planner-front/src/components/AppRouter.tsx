import { FC } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { routes } from "../router";
import { Layout } from "./Layout";

const AppRouter: FC = () => {
    return (
        <Routes>
            <Route element={<Layout hideHeaderPath={["/signup", "/login"]}/>}>
                {routes.map((route) => 
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<route.component />}
                    />
                )}
                <Route path="*" element={<Navigate replace to="/" />}></Route>
            </Route>
        </Routes>
    );
}

export default AppRouter;
