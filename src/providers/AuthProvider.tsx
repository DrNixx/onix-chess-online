import toInteger from 'lodash/toInteger';
import React, { PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {IUser} from "../models/user/IUser";
import {apiGet} from "../services/ApiService";

export const AuthContext = createContext<{
    isAuthenticated: boolean;
    token?: string;
    getUserId: () => number | string | undefined;
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
    const [loaded, setLoaded] = useState(false);
    const token = useMemo<string | undefined>(() => import.meta.env.VITE_USER_API_TOKEN, []);
    const [user, setUser] = useState<IUser | undefined>();
    const isAuthenticated = useMemo<boolean>(() => {
            return !!user?.id
    }, [user?.id]);

    useEffect(() => {
        if (!loaded) {
            setLoaded(true);
            const apiUrl = process.env.NODE_ENV == 'production' ? '' : import.meta.env.VITE_API_URL;
            apiGet(`${apiUrl}/api/user`, { token: token }).then((r) => {
                setUser(r.model);
            });
        }
    }, [loaded, token]);

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
