import { useEffect, useState } from 'react';
import { getVeiculos, createVeiculo, updateVeiculo, deleteVeiculo } from '../api/api';
import { Veiculo } from '../types/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const veiculoSchema = z.object({
    marca: z.string().min(1, 'Marca é obrigatória'),
    modelo: z.string().min(1, 'Modelo é obrigatório'),
    cor: z.string().optional(),
    placa: z.string().regex(/^[A-Z]{3}-\d{4}$/, 'Placa deve seguir o formato ABC-1234'),
});

type VeiculoFormData = z.infer<typeof veiculoSchema>;

const VeiculosPage = () => {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [filteredVeiculos, setFilteredVeiculos] = useState<Veiculo[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<VeiculoFormData>({
        resolver: zodResolver(veiculoSchema),
    });

    useEffect(() => {
        fetchVeiculos();
    }, []);

    useEffect(() => {
        const filtered = veiculos.filter(
            (veiculo) =>
                veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredVeiculos(filtered);
    }, [searchTerm, veiculos]);

    const fetchVeiculos = async () => {
        try {
            const response = await getVeiculos();
            setVeiculos(response.data);
            setFilteredVeiculos(response.data);
        } catch (error) {
            toast.error('Falha ao carregar os veículos.');
        }
    };

    const handleOpenForm = (veiculo?: Veiculo) => {
        if (veiculo) {
            setEditingVeiculo(veiculo);
            reset(veiculo);
        } else {
            setEditingVeiculo(null);
            reset({ marca: '', modelo: '', cor: '', placa: '' });
        }
        setIsOpen(true);
    };

    const onSubmit = async (data: VeiculoFormData) => {
        try {
            const veiculoData = { ...data, id: editingVeiculo?.id || 0 };
            if (editingVeiculo) {
                await updateVeiculo(editingVeiculo.id, veiculoData);
                toast.success('Veículo atualizado com sucesso!');
            } else {
                await createVeiculo(veiculoData);
                toast.success('Veículo criado com sucesso!');
            }
            fetchVeiculos();
            setIsOpen(false);
        } catch (error) {
            toast.error('Falha ao salvar o veículo.');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este veículo?')) {
            try {
                await deleteVeiculo(id);
                toast.success('Veículo excluído com sucesso!');
                fetchVeiculos();
            } catch (error) {
                toast.error('Falha ao excluir o veículo.');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Veículos</h1>
                <Button onClick={() => handleOpenForm()}>+ Novo Veículo</Button>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                    placeholder="Buscar por marca, modelo ou placa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Cor</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredVeiculos.map((veiculo) => (
                        <TableRow key={veiculo.id}>
                            <TableCell>{veiculo.id}</TableCell>
                            <TableCell>{veiculo.marca}</TableCell>
                            <TableCell>{veiculo.modelo}</TableCell>
                            <TableCell>{veiculo.cor}</TableCell>
                            <TableCell>{veiculo.placa}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenForm(veiculo)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(veiculo.id)}>
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
                        <DialogTitle>{editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="marca">Marca</Label>
                            <Input id="marca" {...register('marca')} placeholder="Ex.: Toyota" />
                            {errors.marca && <p className="text-red-500 text-sm">{errors.marca.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="modelo">Modelo</Label>
                            <Input id="modelo" {...register('modelo')} placeholder="Ex.: Corolla" />
                            {errors.modelo && <p className="text-red-500 text-sm">{errors.modelo.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="cor">Cor</Label>
                            <Input id="cor" {...register('cor')} placeholder="Ex.: Preto" />
                            {errors.cor && <p className="text-red-500 text-sm">{errors.cor.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="placa">Placa</Label>
                            <Input id="placa" {...register('placa')} placeholder="Ex.: ABC-1234" />
                            {errors.placa && <p className="text-red-500 text-sm">{errors.placa.message}</p>}
                        </div>
                        <Button type="submit">Salvar</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VeiculosPage;