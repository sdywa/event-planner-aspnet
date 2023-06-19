import React, { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useUser } from "../hooks/useUserContext";
import { UserRole } from "../types/Api";

interface IRequireAuthProps {
    roleLevel: UserRole;
}

export const RequireAuth: FC<IRequireAuthProps> = ({ roleLevel }) => {
    const { user } = useUser();
    const location = useLocation();
    const role = isNaN(user.user.role) ? UserRole.Guest : user.user.role;

    console.log(
        Number(roleLevel),
        roleLevel,
        Number(role),
        role,
        roleLevel <= user.user.role,
        role > Number(UserRole.Guest)
    );

    return roleLevel <= role ? (
        <Outlet />
    ) : role > UserRole.Guest ? (
        <Navigate to="/" />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};
