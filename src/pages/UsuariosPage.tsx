import { useEffect, useState } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api/api';
import { Usuario } from '../types/index';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        email: '',
        password: '',
        role: '',
    });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await getUsuarios();
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    const handleOpenForm = (usuario?: Usuario) => {
        if (usuario) {
            setEditingUsuario(usuario);
            setFormData(usuario);
        } else {
            setEditingUsuario(null);
            setFormData({ id: 0, name: '', email: '', password: '', role: '' });
        }
        setIsOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (editingUsuario) {
                await updateUsuario(editingUsuario.id, formData);
            } else {
                await createUsuario(formData);
            }
            fetchUsuarios();
            setIsOpen(false);
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await deleteUsuario(id);
                fetchUsuarios();
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Usuários</h1>
                <Button onClick={() => handleOpenForm()}>+ Novo Usuário</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>{usuario.id}</TableCell>
                            <TableCell>{usuario.name}</TableCell>
                            <TableCell>{usuario.email}</TableCell>
                            <TableCell>{usuario.role}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenForm(usuario)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(usuario.id)}>
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
                        <DialogTitle>{editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex.: João Silva"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ex.: joao@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Digite a senha"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Função</Label>
                            <Input
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="Ex.: admin ou cliente"
                            />
                        </div>
                        <Button onClick={handleSave}>Salvar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UsuariosPage;