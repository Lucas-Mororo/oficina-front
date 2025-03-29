import axios, { AxiosInstance } from 'axios';
import { Veiculo, Produto, Usuario, OrdemServico } from '../types/index';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipo para criação/edição de Ordem de Serviço (sem objetos aninhados)
export interface OrdemServicoInput {
  id: number;
  preco: string;
  descricao: string;
  status: number;
  usuarioId: number;
  veiculoId: number;
  produtoId: number;
}

// Funções para Veículo
export const getVeiculos = () => api.get<Veiculo[]>('/Veiculo');
export const getVeiculoById = (id: number) => api.get<Veiculo>(`/Veiculo/${id}`);
export const createVeiculo = (veiculo: Veiculo) => api.post<Veiculo>('/Veiculo', veiculo);
export const updateVeiculo = (id: number, veiculo: Veiculo) => api.put<Veiculo>(`/Veiculo/${id}`, veiculo);
export const deleteVeiculo = (id: number) => api.delete(`/Veiculo/${id}`);

// Funções para Produto
export const getProdutos = () => api.get<Produto[]>('/Produto');
export const getProdutoById = (id: number) => api.get<Produto>(`/Produto/${id}`);
export const createProduto = (produto: Produto) => api.post<Produto>('/Produto', produto);
export const updateProduto = (id: number, produto: Produto) => api.put<Produto>(`/Produto/${id}`, produto);
export const deleteProduto = (id: number) => api.delete(`/Produto/${id}`);

// Funções para Usuário
export const getUsuarios = () => api.get<Usuario[]>('/Usuario');
export const getUsuarioById = (id: number) => api.get<Usuario>(`/Usuario/${id}`);
export const createUsuario = (usuario: Usuario) => api.post<Usuario>('/Usuario', usuario);
export const updateUsuario = (id: number, usuario: Usuario) => api.put<Usuario>(`/Usuario/${id}`, usuario);
export const deleteUsuario = (id: number) => api.delete(`/Usuario/${id}`);

// Funções para Ordem de Serviço
export const getOrdensServico = () => api.get<OrdemServico[]>('/OrdemServico');
export const getOrdemServicoById = (id: number) => api.get<OrdemServico>(`/OrdemServico/${id}`);
export const createOrdemServico = (ordem: OrdemServicoInput) => api.post<OrdemServico>('/OrdemServico', ordem);
export const updateOrdemServico = (id: number, ordem: OrdemServicoInput) => api.put<OrdemServico>(`/OrdemServico/${id}`, ordem);
export const deleteOrdemServico = (id: number) => api.delete(`/OrdemServico/${id}`);

export default api;