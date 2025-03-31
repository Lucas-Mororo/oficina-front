import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';

interface AuthContextType {
    user: { id: number; name: string; email: string; role: string } | null;
    login: (name: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Simulação: decodificar token ou buscar usuário
            setUser({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' });
        }
    }, []);

    const login = async (name: string, password: string) => {
        try {
            // Substitua pela sua API de login real
            const response = await axios.post('https://localhost:7241/api/Usuario/login', { name, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
        } catch (error) {
            throw new Error('Credenciais inválidas');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };