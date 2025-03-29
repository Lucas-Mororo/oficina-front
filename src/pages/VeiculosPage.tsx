import { useEffect, useState } from 'react';
import { getVeiculos, createVeiculo, updateVeiculo, deleteVeiculo } from '../api/api';
import { Veiculo } from '../types/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const VeiculosPage = () => {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
    const [formData, setFormData] = useState({
        id: 0,
        marca: '',
        modelo: '',
        cor: '',
        placa: '',
    });

    useEffect(() => {
        fetchVeiculos();
    }, []);

    const fetchVeiculos = async () => {
        try {
            const response = await getVeiculos();
            setVeiculos(response.data);
        } catch (error) {
            toast.error('Falha ao carregar os veículos.');
        }
    };

    const handleOpenForm = (veiculo?: Veiculo) => {
        if (veiculo) {
            setEditingVeiculo(veiculo);
            setFormData(veiculo);
        } else {
            setEditingVeiculo(null);
            setFormData({ id: 0, marca: '', modelo: '', cor: '', placa: '' });
        }
        setIsOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.marca || !formData.modelo || !formData.placa) {
            toast.error('Marca, modelo e placa são obrigatórios.');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            if (editingVeiculo) {
                await updateVeiculo(editingVeiculo.id, formData);
                toast.success('Veículo atualizado com sucesso!');
            } else {
                await createVeiculo(formData);
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
                    {veiculos.map((veiculo) => (
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="marca">Marca</Label>
                            <Input
                                id="marca"
                                name="marca"
                                value={formData.marca}
                                onChange={handleChange}
                                placeholder="Ex.: Toyota"
                            />
                        </div>
                        <div>
                            <Label htmlFor="modelo">Modelo</Label>
                            <Input
                                id="modelo"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleChange}
                                placeholder="Ex.: Corolla"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cor">Cor</Label>
                            <Input
                                id="cor"
                                name="cor"
                                value={formData.cor}
                                onChange={handleChange}
                                placeholder="Ex.: Preto"
                            />
                        </div>
                        <div>
                            <Label htmlFor="placa">Placa</Label>
                            <Input
                                id="placa"
                                name="placa"
                                value={formData.placa}
                                onChange={handleChange}
                                placeholder="Ex.: ABC-1234"
                            />
                        </div>
                        <Button onClick={handleSave}>Salvar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VeiculosPage;