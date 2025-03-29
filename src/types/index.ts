// Tipo para Veículo
export interface Veiculo {
    id: number;
    marca: string;
    modelo: string;
    cor: string;
    placa: string;
}

// Tipo para Produto
export interface Produto {
    id: number;
    descricao: string;
    preco: string; // Pode mudar para number se a API aceitar valores numéricos
    qtdEstoque: string; // Pode mudar para number se a API aceitar valores numéricos
}

// Tipo para Usuário
export interface Usuario {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string; // Ex.: "admin" ou "cliente"
}

// Tipo para Ordem de Serviço
export interface OrdemServico {
    id: number;
    preco: string; // Pode mudar para number se a API aceitar valores numéricos
    descricao: string;
    status: number; // 1 = aberto, por exemplo (ajuste conforme sua lógica)
    usuarioId: number;
    usuario: Usuario;
    veiculoId: number;
    veiculo: Veiculo;
    produtoId: number;
    produto: Produto;
}