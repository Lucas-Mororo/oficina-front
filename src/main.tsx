import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VeiculosPage from './pages/VeiculosPage';
import ProdutosPage from './pages/ProdutosPage';
import UsuariosPage from './pages/UsuariosPage';
import OrdensServicoPage from './pages/OrdensServicoPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<div className="text-2xl">Bem-vindo à Oficina!</div>} />
              <Route path="/veiculos" element={<VeiculosPage />} />
              <Route path="/produtos" element={<ProdutosPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/ordens-servico" element={<OrdensServicoPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
