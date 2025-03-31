import { useEffect, useState } from 'react';
import { getProdutos, createProduto, updateProduto, deleteProduto } from '../api/api';
import { Produto } from '../types/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';

const ProdutosPage = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
    const [formData, setFormData] = useState<Produto>({
        descrição: '',
        preco: 0,
        qtdEstoque: 0,
    });
    console.log(formData);


    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        try {
            const response = await getProdutos();
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleOpenForm = (produto?: Produto) => {
        if (produto) {
            setEditingProduto(produto);
            setFormData(produto);
        } else {
            setEditingProduto(null);
            setFormData({ descrição: '', preco: 0, qtdEstoque: 0 });
        }
        setIsOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingProduto) {
                if (editingProduto.id)
                    await updateProduto(editingProduto.id, formData);
            } else {
                await createProduto(formData);
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
        } finally {
            setTimeout(() => {
                fetchProdutos();
            }, 3000);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await deleteProduto(id);
                fetchProdutos();
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Produtos</h1>
                <Button onClick={() => handleOpenForm()}>+ Novo Produto</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Quantidade em Estoque</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {produtos.map((produto) => (
                        <TableRow key={produto.id}>
                            <TableCell>{produto.id}</TableCell>
                            <TableCell>{produto.descrição}</TableCell>
                            <TableCell>{produto.preco}</TableCell>
                            <TableCell>{produto.qtdEstoque}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenForm(produto)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                    if (produto.id)
                                        handleDelete(produto.id)
                                }}>
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
                        <DialogTitle>{editingProduto ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input
                                id="descricao"
                                name="descricao"
                                value={formData.descrição}
                                onChange={(e) => {
                                    setFormData({ ...formData, descrição: e.target.value });
                                }}
                                placeholder="Ex.: Óleo de Motor"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="preco">Preço</Label>
                            <Input
                                id="preco"
                                name="preco"
                                value={formData.preco}
                                type='number'
                                onChange={(e) => {
                                    setFormData({ ...formData, preco: Number(e.target.value) });
                                }}
                                placeholder="Ex.: 50.00"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="qtdEstoque">Quantidade em Estoque</Label>
                            <Input
                                id="qtdEstoque"
                                name="qtdEstoque"
                                value={formData.qtdEstoque}
                                type='number'
                                onChange={(e) => {
                                    setFormData({ ...formData, qtdEstoque: Number(e.target.value) });
                                }}
                                placeholder="Ex.: 10"
                            />
                        </div>
                        <Button onClick={handleSave}>Salvar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProdutosPage;