// import { createContext, useContext, useState } from "react";

// import {
//     login as loginUser,
//     logout as logoutUser,
//     getCurrentUser,
// } from "../services/authService";

// const AuthContext = createContext(null);





// export function AuthProvider({ children }) {

//     const [user, setUser] = useState(getCurrentUser());

//     const login = async (email, password) => {

//         const data = await loginUser(email, password);

//         setUser({
//             userId: data.userId,
//             name: data.name,
//             email: data.email,
//             role: data.role,
//         });

//         return data;
//     };

//     const logout = () => {

//         logoutUser();

//         setUser(null);
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 login,
//                 logout,
//                 isLoggedIn: !!user,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     return useContext(AuthContext);
// }


import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    login as loginUser,
    logout as logoutUser,
    getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

function getTokenExpiry() {

    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {

        const payload = JSON.parse(
            atob(
                token
                    .split(".")[1]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );

        return payload.exp
            ? payload.exp * 1000
            : null;

    } catch (error) {

        return null;
    }
}

function getValidUser() {

    const token = localStorage.getItem("token");
    const user = getCurrentUser();

    if (!token || !user) {
        return null;
    }

    const expiry = getTokenExpiry();

    if (!expiry || Date.now() >= expiry) {

        logoutUser();

        return null;
    }

    return user;
}

export function AuthProvider({ children }) {

    const [user, setUser] = useState(getValidUser);

    // useEffect(() => {

    //     if (!user) {
    //         return;
    //     }

    //     const expiry = getTokenExpiry();

    //     if (!expiry) {

    //         logoutUser();
    //         setUser(null);

    //         return;
    //     }

    //     const remainingTime = expiry - Date.now();

    //     if (remainingTime <= 0) {

    //         logoutUser();
    //         setUser(null);

    //         return;
    //     }

    //     const timer = setTimeout(() => {

    //         logoutUser();
    //         setUser(null);

    //     }, remainingTime);

    //     return () => clearTimeout(timer);

    // }, [user]);

    useEffect(() => {
    if (!user) return;

    const expiry = getTokenExpiry();

    if (!expiry) {
        logoutUser();
        setUser(null);
        return;
    }

    const remainingTime = expiry - Date.now();

    if (remainingTime <= 0) {
        logoutUser();
        setUser(null);
        return;
    }

    const timer = setTimeout(() => {
        logoutUser();
        setUser(null);
    }, remainingTime);

    const handleAuthLogout = () => {
        setUser(null);
    };

    window.addEventListener(
        "auth-logout",
        handleAuthLogout
    );

    return () => {
        clearTimeout(timer);
        window.removeEventListener(
            "auth-logout",
            handleAuthLogout
        );
    };
}, [user]);

    const login = async (email, password) => {

        const data = await loginUser(
            email,
            password
        );

        const loggedInUser = {
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
        };

        setUser(loggedInUser);

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