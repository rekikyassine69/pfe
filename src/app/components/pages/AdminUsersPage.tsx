import { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AddUserModal } from '@/app/components/modals/AddUserModal';
import { EditUserModal } from '@/app/components/modals/EditUserModal';
import { DeleteConfirmModal } from '@/app/components/modals/DeleteConfirmModal';
import { useCollection } from '@/app/hooks/useCollection';
import { api } from '@/app/services/api';

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: pots } = useCollection<any>('potsConnectes');

  const potCountByClient = useMemo(() => {
    const counts = new Map<string, number>();
    pots.forEach((pot) => {
      const clientId = pot.clientId?.$oid ?? pot.clientId;
      if (!clientId) return;
      counts.set(clientId, (counts.get(clientId) || 0) + 1);
    });
    return counts;
  }, [pots]);

  const formatDate = (value: any) => {
    const date = value?.$date ? new Date(value.$date) : new Date(value);
    if (Number.isNaN(date.getTime())) return { label: '—', value: null };
    return {
      label: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      value: date,
    };
  };

  const toStatusKey = (statut?: string) => (statut === 'inactif' || statut === 'inactive' ? 'inactive' : 'active');
  const toStatusLabel = (key: string) => (key === 'inactive' ? 'Inactif' : 'Actif');

  const mapName = (nom?: string, prenom?: string) => {
    const parts = [prenom, nom].filter(Boolean).join(' ').trim();
    return parts || nom || 'Utilisateur';
  };

  const parseName = (fullName: string) => {
    const clean = (fullName || '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    const prenom = parts.shift() || '';
    const nom = parts.join(' ') || prenom || '';
    return { nom, prenom };
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [clientData, adminData] = await Promise.all([
        api.adminGetUsers().catch(err => {
          console.error('Error fetching users:', err);
          return [];
        }),
        api.adminGetAdmins().catch(err => {
          console.error('Error fetching admins:', err);
          return [];
        }),
      ]);

      const mappedAdmins = (adminData || []).map((admin: any) => {
        const { label, value } = formatDate(admin.dateCreation || admin.dateInscription || admin.createdAt);
        return {
          id: admin._id,
          name: mapName(admin.nom, admin.prenom),
          email: admin.email,
          phone: admin.telephone || '—',
          roleKey: 'admin',
          roleLabel: 'Admin',
          statusKey: toStatusKey(admin.statut),
          statusLabel: toStatusLabel(toStatusKey(admin.statut)),
          pots: 0,
          joinDate: label,
          joinDateValue: value,
        };
      });

      const mappedClients = (clientData || []).map((client: any) => {
        const clientId = client._id?.$oid ?? client._id;
        const { label, value } = formatDate(client.dateInscription || client.dateCreation || client.createdAt);
        const statusKey = toStatusKey(client.statut);
        return {
          id: client._id,
          name: mapName(client.nom, client.prenom),
          email: client.email,
          phone: client.telephone || '—',
          roleKey: 'client',
          roleLabel: 'Client',
          statusKey,
          statusLabel: toStatusLabel(statusKey),
          pots: potCountByClient.get(clientId) || 0,
          joinDate: label,
          joinDateValue: value,
        };
      });

      if (mappedAdmins.length > 0 || mappedClients.length > 0) {
        setUsers([...mappedAdmins, ...mappedClients]);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      if (error?.message?.includes('401') || error?.message?.includes('Authentification')) {
        // Silently handle auth errors - user may need to re-login
        setUsers([]);
      } else {
        toast.error('Erreur lors du chargement des utilisateurs');
      }
    } finally {
      setLoading(false);
    }
  }, [potCountByClient]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const recentUsersCount = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const isRecent = (value: any) => {
      const date = value?.$date ? new Date(value.$date) : new Date(value);
      return !Number.isNaN(date.getTime()) && now - date.getTime() <= thirtyDays;
    };
    return users
      .map((u) => u.joinDateValue)
      .filter((value) => value && isRecent(value)).length;
  }, [users]);

  const stats = [
    { label: 'Total Utilisateurs', value: String(users.length), icon: Users, color: 'text-chart-1' },
    { label: 'Actifs ce mois', value: String(users.length), icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Nouveaux (30j)', value: String(recentUsersCount), icon: Plus, color: 'text-chart-2' },
    { label: 'Inactifs', value: '0', icon: XCircle, color: 'text-orange-500' },
  ];

  const handleAddUser = async (user: { name: string; email: string; password: string; role: 'client' | 'admin'; status: 'active' | 'inactive' }) => {
    try {
      const { nom, prenom } = parseName(user.name);
      const payload = {
        nom,
        prenom,
        email: user.email,
        motDePasse: user.password,
        statut: user.status === 'inactive' ? 'inactif' : 'actif',
      };

      if (user.role === 'admin') {
        await api.adminCreateAdmin(payload);
      } else {
        await api.adminCreateUser(payload);
      }

      toast.success(`Utilisateur "${user.name}" cree avec succes !`);
      await loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erreur lors de la creation de l\'utilisateur');
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (id: string, updatedData: any) => {
    if (!selectedUser) return;
    try {
      const { nom, prenom } = parseName(updatedData.name);
      const payload = {
        nom,
        prenom,
        email: updatedData.email,
        statut: updatedData.status === 'inactive' ? 'inactif' : 'actif',
      };

      // Check if role has changed
      const roleChanged = selectedUser.roleKey !== updatedData.role;
      
      if (roleChanged) {
        // Change role (this will transfer the user between collections)
        await api.adminChangeUserRole(id, updatedData.role);
        toast.success(`Utilisateur "${updatedData.name}" promu en ${updatedData.role === 'admin' ? 'administrateur' : 'client'} !`);
      }

      // Update other fields based on current role
      if (selectedUser.roleKey === 'admin' && !roleChanged) {
        await api.adminUpdateAdmin(id, payload);
        toast.success(`Administrateur "${updatedData.name}" mis a jour !`);
      } else if (selectedUser.roleKey === 'client' && !roleChanged) {
        await api.adminUpdateUser(id, payload);
        toast.success(`Client "${updatedData.name}" mis a jour !`);
      }

      setShowEditModal(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Erreur lors de la mise a jour');
    }
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      if (selectedUser.roleKey === 'admin') {
        await api.adminDeleteAdmin(selectedUser.id);
      } else {
        await api.adminDeleteUser(selectedUser.id);
      }
      toast.success(`Utilisateur "${selectedUser.name}" supprime !`);
      setSelectedUser(null);
      await loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-muted-foreground">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
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
                      user.roleLabel === 'Admin'
                        ? 'bg-purple-500/20 text-purple-600'
                        : 'bg-blue-500/20 text-blue-600'
                    }`}>
                      {user.roleLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.statusLabel === 'Actif'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-orange-500/20 text-orange-600'
                    }`}>
                      {user.statusLabel}
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
              )))}
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
        user={selectedUser ? {
          id: selectedUser.id,
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.roleKey,
          status: selectedUser.statusKey,
        } : null}
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