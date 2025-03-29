import { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Car, Package, User, Wrench, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Toaster } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
    children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h1 className="text-2xl font-bold mb-6">Oficina</h1>
                {user && (
                    <p className="mb-4">Olá, {user.name} ({user.role})</p>
                )}
                <nav className="space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-gray-700">
                        <Link to="/veiculos">
                            <Car className="mr-2 h-5 w-5" /> Veículos
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-gray-700">
                        <Link to="/produtos">
                            <Package className="mr-2 h-5 w-5" /> Produtos
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-gray-700">
                        <Link to="/usuarios">
                            <User className="mr-2 h-5 w-5" /> Usuários
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-gray-700">
                        <Link to="/ordens-servico">
                            <Wrench className="mr-2 h-5 w-5" /> Ordens de Serviço
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-gray-700"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-5 w-5" /> Sair
                    </Button>
                </nav>
            </aside>
            <main className="flex-1 p-6 bg-gray-100">
                {children || <Outlet />}
            </main>
            <Toaster />
        </div>
    );
};

export default Layout;