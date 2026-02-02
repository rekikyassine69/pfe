import { useEffect, useMemo, useState } from 'react';
import { Users, Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { AddUserModal } from '@/app/components/modals/AddUserModal';
import { EditUserModal } from '@/app/components/modals/EditUserModal';
import { DeleteConfirmModal } from '@/app/components/modals/DeleteConfirmModal';
import { useCollection } from '@/app/hooks/useCollection';

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const { data: clients } = useCollection<any>('clients');
  const { data: admins } = useCollection<any>('administrateurs');
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

  useEffect(() => {
    const formatDate = (value: any) => {
      const date = value?.$date ? new Date(value.$date) : new Date(value);
      if (Number.isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const mappedAdmins = admins.map((admin) => ({
      id: admin.idAdmin ?? admin._id,
      name: admin.nom || 'Admin',
      email: admin.email,
      phone: '—',
      role: 'Admin',
      status: 'Actif',
      pots: 0,
      joinDate: formatDate(admin.dateCreation),
    }));

    const mappedClients = clients.map((client) => {
      const clientId = client._id?.$oid ?? client._id;
      return {
        id: client.idClient ?? client._id,
        name: client.nom || 'Client',
        email: client.email,
        phone: '—',
        role: 'Client',
        status: 'Actif',
        pots: potCountByClient.get(clientId) || 0,
        joinDate: formatDate(client.dateInscription),
      };
    });

    if (mappedAdmins.length || mappedClients.length) {
      setUsers([...mappedAdmins, ...mappedClients]);
    }
  }, [admins, clients, potCountByClient]);

  const recentUsersCount = useMemo(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const isRecent = (value: any) => {
      const date = value?.$date ? new Date(value.$date) : new Date(value);
      return !Number.isNaN(date.getTime()) && now - date.getTime() <= thirtyDays;
    };
    return [
      ...admins.map((a) => a.dateCreation),
      ...clients.map((c) => c.dateInscription),
    ].filter(isRecent).length;
  }, [admins, clients]);

  const stats = [
    { label: 'Total Utilisateurs', value: String(users.length), icon: Users, color: 'text-chart-1' },
    { label: 'Actifs ce mois', value: String(users.length), icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Nouveaux (30j)', value: String(recentUsersCount), icon: Plus, color: 'text-chart-2' },
    { label: 'Inactifs', value: '0', icon: XCircle, color: 'text-orange-500' },
  ];

  const handleAddUser = (user: any) => {
    setUsers([...users, user]);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = (id: string, updatedData: any) => {
    setUsers(users.map(user => 
      user.id.toString() === id ? { ...user, ...updatedData } : user
    ));
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      toast.success(`Utilisateur "${selectedUser.name}" supprimé !`);
      setSelectedUser(null);
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
                      user.role === 'Admin'
                        ? 'bg-purple-500/20 text-purple-600'
                        : 'bg-blue-500/20 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Actif'
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