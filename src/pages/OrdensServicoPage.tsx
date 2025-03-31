import { useEffect, useState } from 'react';
import { getOrdensServico, createOrdemServico, updateOrdemServico, deleteOrdemServico, getUsuarios, getVeiculos, getProdutos, OrdemServicoInput } from '../api/api';
import { OrdemServico, Usuario, Veiculo, Produto } from '../types/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
    const [filteredOrdens, setFilteredOrdens] = useState<OrdemServico[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingOrdem, setEditingOrdem] = useState<OrdemServico | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        register,
        handleSubmit,
        control,
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

    useEffect(() => {
        const filtered = ordens.filter(
            (ordem) =>
                (ordem.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (ordem.usuario?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (ordem.veiculo?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (ordem.produto?.descrição?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
        );
        setFilteredOrdens(filtered);
    }, [searchTerm, ordens]);

    const fetchData = async () => {
        try {
            const [ordensRes, usuariosRes, veiculosRes, produtosRes] = await Promise.all([
                getOrdensServico(),
                getUsuarios(),
                getVeiculos(),
                getProdutos(),
            ]);
            setOrdens(ordensRes.data || []);
            setFilteredOrdens(ordensRes.data || []);
            setUsuarios(usuariosRes.data || []);
            setVeiculos(veiculosRes.data || []);
            setProdutos(produtosRes.data || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Falha ao carregar os dados.');
        }
    };

    const handleOpenForm = (ordem?: OrdemServico) => {
        if (ordem) {
            setEditingOrdem(ordem);
            reset({
                descricao: ordem.descricao || '',
                preco: ordem.preco || '',
                status: ordem.status || 1,
                usuarioId: ordem.usuarioId || 0,
                veiculoId: ordem.veiculoId || 0,
                produtoId: ordem.produtoId || 0,
            });
        } else {
            setEditingOrdem(null);
            reset({
                descricao: '',
                preco: '',
                status: 1,
                usuarioId: 0,
                veiculoId: 0,
                produtoId: 0
            });
        }
        setIsOpen(true);
    };

    const onSubmit = async (data: OrdemServicoFormData) => {
        try {
            const ordemData: OrdemServicoInput = {
                ...data,
                id: editingOrdem?.id || 0,
            };

            if (editingOrdem) {
                await updateOrdemServico(editingOrdem.id, ordemData);
                toast.success('Ordem de serviço atualizada com sucesso!');
            } else {
                await createOrdemServico(ordemData);
                toast.success('Ordem de serviço criada com sucesso!');
            }
            await fetchData();
            setIsOpen(false);
        } catch (error) {
            console.error('Erro ao salvar ordem de serviço:', error);
            toast.error('Falha ao salvar a ordem de serviço.');
        }
    };

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
            try {
                await deleteOrdemServico(id);
                toast.success('Ordem de serviço excluída com sucesso!');
                await fetchData();
            } catch (error) {
                console.error('Erro ao excluir ordem de serviço:', error);
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

            <div className="mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                    placeholder="Buscar por descrição, usuário, veículo ou produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
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
                    {filteredOrdens.map((ordem) => (
                        <TableRow key={ordem?.id || Math.random()}>
                            <TableCell>{ordem?.id || '-'}</TableCell>
                            <TableCell>{ordem?.descricao || '-'}</TableCell>
                            <TableCell>{ordem?.preco || '-'}</TableCell>
                            <TableCell>{ordem?.status || '-'}</TableCell>
                            <TableCell>{ordem?.usuario?.name || '-'}</TableCell>
                            <TableCell>{ordem?.veiculo?.placa || '-'}</TableCell>
                            <TableCell>{ordem?.produto?.descrição || '-'}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenForm(ordem)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(ordem?.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="p-6 bg-white rounded-lg shadow-lg max-w-md">
                    <DialogHeader className="relative">
                        <DialogTitle>{editingOrdem ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input id="descricao" {...register('descricao')} placeholder="Ex.: Troca de óleo" />
                            {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="preco">Preço</Label>
                            <Input id="preco" {...register('preco')} placeholder="Ex.: 150.00" />
                            {errors.preco && <p className="text-red-500 text-sm">{errors.preco.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="status">Status</Label>
                            <Input
                                id="status"
                                type="number"
                                {...register('status', { valueAsNumber: true })}
                                placeholder="Ex.: 1 (aberto)"
                            />
                            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="usuarioId"
                                className="block text-sm font-medium text-gray-700">Usuário</Label>
                            <Controller
                                name="usuarioId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value.toString()}
                                    >
                                        <SelectTrigger className="w-full rounded-md shadow-sm sm:text-sm">
                                            <SelectValue placeholder="Selecione um usuário" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="0" disabled>Selecione um usuário</SelectItem>
                                            {usuarios.map((usuario) => (
                                                <SelectItem key={usuario.id} value={usuario.id.toString()}>
                                                    {usuario.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.usuarioId && <p className="text-red-500 text-sm">{errors.usuarioId.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="veiculoId" className="text-sm font-medium text-gray-700">Veículo</Label>
                            <Controller
                                name="veiculoId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value.toString()}
                                    >
                                        <SelectTrigger className="w-full rounded-md shadow-sm">
                                            <SelectValue placeholder="Selecione um veículo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="0" disabled>Selecione um veículo</SelectItem>
                                            {veiculos.map((veiculo) => (
                                                <SelectItem key={veiculo.id} value={veiculo.id.toString()}>
                                                    {veiculo.placa} - {veiculo.marca} {veiculo.modelo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.veiculoId && <p className="text-red-500 text-sm">{errors.veiculoId.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="produtoId" className="text-sm font-medium text-gray-700">Produto</Label>
                            <Controller
                                name="produtoId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={field.value.toString()}
                                    >
                                        <SelectTrigger className="w-full rounded-md shadow-sm">
                                            <SelectValue placeholder="Selecione um produto" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="0" disabled>Selecione um produto</SelectItem>
                                            {produtos.map((produto) => (
                                                <SelectItem key={produto.id} value={produto.id ? produto.id.toString() : ""}>
                                                    {produto.descrição}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
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