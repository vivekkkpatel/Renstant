import { createContext, useContext, useState } from "react";

import {
    login as loginUser,
    logout as logoutUser,
    getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(getCurrentUser());

    const login = async (email, password) => {

        const data = await loginUser(email, password);

        setUser({
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
        });

        return data;
    };

    const logout = () => {

        logoutUser();

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isLoggedIn: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}