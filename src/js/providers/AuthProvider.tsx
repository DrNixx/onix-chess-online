import toInteger from 'lodash/toInteger';
import React, { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {IUser} from "../models/user/IUser";
import {apiGet} from "../services/ApiService";


export const AuthContext = createContext<{
    isAuthenticated: boolean;
    token?: string;
    getUserId: () => number | undefined;
    getUserName: () => string | undefined;
    getFirstName: () => string | undefined;
}>({
    isAuthenticated: false,
    token: undefined,
    getUserId: () => undefined,
    getUserName: () => undefined,
    getFirstName: () => undefined,
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const isAuthenticated = useMemo<boolean>(
        () => process.env.NODE_ENV == 'production' || !!import.meta.env.VITE_USER_API_TOKEN,
        [],
    );

    const token = useMemo<string | undefined>(() => import.meta.env.VITE_USER_API_TOKEN, []);
    const [user, setUser] = useState<IUser | undefined>();

    useEffect(() => {
        if (isAuthenticated) {
            const apiUrl = process.env.NODE_ENV == 'production' ? '' : import.meta.env.VITE_API_URL;
            apiGet(`${apiUrl}/api/user`, { token: token }).then((r) => {
                setUser(r.model);
            });
        }
    }, [isAuthenticated, token]);

    const getUserId = useCallback(() => {
        return toInteger(user?.id);
    }, [user?.id]);

    const getUserName = useCallback(() => {
        return user?.display;
    }, [user?.display]);

    const getFirstName = useCallback(() => {
        return user?.name;
    }, [user?.name]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, getUserId, getUserName, getFirstName }}>
            {children}
        </AuthContext.Provider>
    );
};
