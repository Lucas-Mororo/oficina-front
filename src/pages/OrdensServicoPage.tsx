import { useEffect, useState } from 'react';
import { getOrdensServico, createOrdemServico, updateOrdemServico, deleteOrdemServico, getUsuarios, getVeiculos, getProdutos, OrdemServicoInput } from '../api/api';
import { OrdemServico, Usuario, Veiculo, Produto } from '../types/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validação com Zod
const ordemServicoSchema = z.object({
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    preco: z.string().min(1, 'Preço é obrigatório').regex(/^\d+(\.\d{1,2})?$/, 'Preço deve ser um número válido'),
    status: z.number().min(1, 'Status é obrigatório'),
    usuarioId: z.number().min(1, 'Selecione um usuário'),
    veiculoId: z.number().min(1, 'Selecione um veículo'),
    produtoId: z.number().min(1, 'Selecione um produto'),
});

type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>;

const OrdensServicoPage = () => {
    const [ordens, setOrdens] = useState<OrdemServico[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingOrdem, setEditingOrdem] = useState<OrdemServico | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<OrdemServicoFormData>({
        resolver: zodResolver(ordemServicoSchema),
        defaultValues: {
            descricao: '',
            preco: '',
            status: 1,
            usuarioId: 0,
            veiculoId: 0,
            produtoId: 0,
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordensRes, usuariosRes, veiculosRes, produtosRes] = await Promise.all([
                getOrdensServico(),
                getUsuarios(),
                getVeiculos(),
                getProdutos(),
            ]);
            setOrdens(ordensRes.data);
            setUsuarios(usuariosRes.data);
            setVeiculos(veiculosRes.data);
            setProdutos(produtosRes.data);
        } catch (error) {
            toast.error('Falha ao carregar os dados.');
        }
    };

    const handleOpenForm = (ordem?: OrdemServico) => {
        if (ordem) {
            setEditingOrdem(ordem);
            reset({
                descricao: ordem.descricao,
                preco: ordem.preco,
                status: ordem.status,
                usuarioId: ordem.usuarioId,
                veiculoId: ordem.veiculoId,
                produtoId: ordem.produtoId,
            });
        } else {
            setEditingOrdem(null);
            reset({ descricao: '', preco: '', status: 1, usuarioId: 0, veiculoId: 0, produtoId: 0 });
        }
        setIsOpen(true);
    };

    const handleSelectChange = (name: keyof OrdemServicoFormData, value: string) => {
        setValue(name, Number(value));
    };

    const onSubmit = async (data: OrdemServicoFormData) => {
        try {
            const ordemData: OrdemServicoInput = { ...data, id: editingOrdem?.id || 0 };
            if (editingOrdem) {
                await updateOrdemServico(editingOrdem.id, ordemData);
                toast.success('Ordem de serviço atualizada com sucesso!');
            } else {
                await createOrdemServico(ordemData);
                toast.success('Ordem de serviço criada com sucesso!');
            }
            fetchData();
            setIsOpen(false);
        } catch (error) {
            toast.error('Falha ao salvar a ordem de serviço.');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
            try {
                await deleteOrdemServico(id);
                toast.success('Ordem de serviço excluída com sucesso!');
                fetchData();
            } catch (error) {
                toast.error('Falha ao excluir a ordem de serviço.');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
                <Button onClick={() => handleOpenForm()}>+ Nova Ordem</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Veículo</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ordens.map((ordem) => (
                        <TableRow key={ordem.id}>
                            <TableCell>{ordem.id}</TableCell>
                            <TableCell>{ordem.descricao}</TableCell>
                            <TableCell>{ordem.preco}</TableCell>
                            <TableCell>{ordem.status}</TableCell>
                            <TableCell>{ordem.usuario.name}</TableCell>
                            <TableCell>{ordem.veiculo.placa}</TableCell>
                            <TableCell>{ordem.produto.descricao}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenForm(ordem)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(ordem.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingOrdem ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input id="descricao" {...register('descricao')} placeholder="Ex.: Troca de óleo" />
                            {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="preco">Preço</Label>
                            <Input id="preco" {...register('preco')} placeholder="Ex.: 150.00" />
                            {errors.preco && <p className="text-red-500 text-sm">{errors.preco.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Input
                                id="status"
                                type="number"
                                {...register('status', { valueAsNumber: true })}
                                placeholder="Ex.: 1 (aberto)"
                            />
                            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="usuarioId">Usuário</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('usuarioId', value)}
                                defaultValue={editingOrdem?.usuarioId.toString() || '0'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um usuário" />
                                </SelectTrigger>
                                <SelectContent>
                                    {usuarios.map((usuario) => (
                                        <SelectItem key={usuario.id} value={usuario.id.toString()}>
                                            {usuario.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.usuarioId && <p className="text-red-500 text-sm">{errors.usuarioId.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="veiculoId">Veículo</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('veiculoId', value)}
                                defaultValue={editingOrdem?.veiculoId.toString() || '0'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um veículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {veiculos.map((veiculo) => (
                                        <SelectItem key={veiculo.id} value={veiculo.id.toString()}>
                                            {veiculo.placa} - {veiculo.marca} {veiculo.modelo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.veiculoId && <p className="text-red-500 text-sm">{errors.veiculoId.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="produtoId">Produto</Label>
                            <Select
                                onValueChange={(value) => handleSelectChange('produtoId', value)}
                                defaultValue={editingOrdem?.produtoId.toString() || '0'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {produtos.map((produto) => (
                                        <SelectItem key={produto.id} value={produto.id.toString()}>
                                            {produto.descricao}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.produtoId && <p className="text-red-500 text-sm">{errors.produtoId.message}</p>}
                        </div>
                        <Button type="submit">Salvar</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrdensServicoPage;