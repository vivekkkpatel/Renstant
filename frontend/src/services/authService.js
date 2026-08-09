import api from "./api";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    const data = response.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
    }));

    return data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
};