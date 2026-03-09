import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    wishlist?: string[];
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        toast.success("Successfully logged in!");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
