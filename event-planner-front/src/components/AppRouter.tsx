import React, { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { authRoutes, routes } from "../router";
import { UserRole } from "../types/Api";

import { AuthLayout } from "./layouts/AuthLayout";
import { Layout } from "./Layout";
import { RequireAuth } from "./RequireAuth";

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
                {Object.entries(routes).map(([key, routes]) => (
                    <Route
                        key={key}
                        element={
                            <RequireAuth
                                roleLevel={key as unknown as UserRole}
                            />
                        }
                    >
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                    </Route>
                ))}
                <Route path="*" element={<Navigate replace to="/" />}></Route>
            </Route>
        </Routes>
    );
};
