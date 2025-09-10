import { createContext, useState, useEffect, ReactNode } from "react";
import {FullUser} from "../types/user.ts";
import {isTokenValid} from "../utils/auth.ts";
import {logoutUser} from "../api/auth.ts";
import {useTranslation} from "react-i18next";
import {handleApiError} from "../utils/errorHelpers.ts";
import {showErrorToast} from "../components/ui/Toaster/Toaster.tsx";

interface AuthContextType {
    user: FullUser | null;
    setUser: (user: FullUser | null) => void;
    isAuthenticated: boolean;
    isAuthChecked: boolean;
    signOut: () => Promise<void>;
    isSigningOut: boolean;
    setIsSigningOut: (value: boolean) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    isAuthenticated: false,
    isAuthChecked: false,
    isSigningOut: false,
    setIsSigningOut: () => {},
    signOut: async () => Promise.resolve(),
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<FullUser | null>(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { t: tError } = useTranslation('error');

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken && isTokenValid(accessToken)) {
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthChecked(true);
        }
        setIsAuthChecked(true);
    }, []);

    const handleSetUser = (newUser: FullUser | null) => {
        if (newUser) {
            localStorage.setItem('currentUser', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('currentUser');
        }
        setUser(newUser);
    };

    const signOut = async () => {
        try {
            setIsSigningOut(true);
            await logoutUser();
        } catch (error) {
            const { global } = handleApiError(error, tError);
            if (global) showErrorToast(global);
        } finally {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsSigningOut(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser: handleSetUser,
            isAuthenticated: Boolean(user),
            isAuthChecked,
            signOut,
            isSigningOut,
            setIsSigningOut,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};
