import React, { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { authRoutes, routes } from "../router";

import { AuthLayout } from "./layouts/AuthLayout";
import { Layout } from "./Layout";

export const AppRouter: FC = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                {authRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}
            </Route>
            <Route element={<Layout hideHeaderPath={["/signup", "/login"]} />}>
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />}></Route>
            </Route>
        </Routes>
    );
};
