import { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AddUserModal } from '@/app/components/modals/AddUserModal';
import { EditUserModal } from '@/app/components/modals/EditUserModal';
import { DeleteConfirmModal } from '@/app/components/modals/DeleteConfirmModal';

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingUsers(true);
    (async () => {
      try {
        const api = await import('@/lib/api');
        const list = await api.getUsers();
        if (mounted) setUsers(list);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = [
    { label: 'Total Utilisateurs', value: '2,847', icon: Users, color: 'text-chart-1' },
    { label: 'Actifs ce mois', value: '1,892', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Nouveaux (30j)', value: '234', icon: Plus, color: 'text-chart-2' },
    { label: 'Inactifs', value: '89', icon: XCircle, color: 'text-orange-500' },
  ];

  const handleAddUser = async (user: any) => {
    try {
      const api = await import('@/lib/api');
      const created = await api.addUser(user);
      setUsers(prev => [...prev, created]);
      toast.success(`Utilisateur "${created.name}" ajouté !`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (id: string, updatedData: any) => {
    try {
      const api = await import('@/lib/api');
      const updated = await api.updateUser(id, updatedData);
      setUsers(prev => prev.map(u => u.id.toString() === id ? { ...u, ...updated } : u));
      toast.success(`Utilisateur "${updated.name}" mis à jour !`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        const api = await import('@/lib/api');
        await api.deleteUser(selectedUser.id.toString());
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        toast.success(`Utilisateur "${selectedUser.name}" supprimé !`);
        setSelectedUser(null);
      } catch (err: any) {
        toast.error(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les comptes clients et administrateurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-semibold text-foreground mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter Utilisateur
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Utilisateur</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rôle</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Pots</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Inscription</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (user.role || '').toString().toLowerCase() === 'admin'
                        ? 'bg-purple-500/20 text-purple-600'
                        : 'bg-blue-500/20 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (user.status || '').toString().toLowerCase() === 'active'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-orange-500/20 text-orange-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground font-medium">{user.pots}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{user.joinDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Éditer"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredUsers.length} sur {users.length} utilisateurs
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
            Précédent
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            1
          </button>
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
            2
          </button>
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
            Suivant
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddUser}
      />
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.`}
        itemName={selectedUser?.name}
      />
    </div>
  );
}