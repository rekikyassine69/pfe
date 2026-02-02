import { Modal } from './Modal';
import { Package, User, MapPin, CreditCard, Calendar, Truck } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  items: string;
  total: string;
  status: string;
  date: string;
  address?: string;
  phone?: string;
  payment?: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré':
        return 'bg-green-500/20 text-green-600';
      case 'En cours':
        return 'bg-blue-500/20 text-blue-600';
      case 'En attente':
        return 'bg-orange-500/20 text-orange-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Commande ${order.id}`} maxWidth="2xl">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{order.date}</span>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informations Client
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.phone || '+33 6 12 34 56 78'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 inline mr-1" />
                Adresse
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.address || '123 Rue de la Plante, 75001 Paris'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Articles Commandés
          </h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Produit
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Quantité
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Prix
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{order.items}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">1</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">
                    {order.total}
                  </td>
                </tr>
                {order.items.includes('Pack') && (
                  <>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 pl-8">
                        • Pot connecté x3
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">3</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 pl-8">
                        • Capteurs intelligents
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400">3</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-400">-</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Paiement
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Méthode: <span className="font-medium text-gray-900 dark:text-white">
                {order.payment || 'Carte bancaire'}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Total: <span className="text-lg font-bold text-green-600">{order.total}</span>
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Livraison
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Statut: <span className="font-medium text-gray-900 dark:text-white">{order.status}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Estimée: <span className="font-medium text-gray-900 dark:text-white">
                {order.status === 'Livré' ? 'Déjà livré' : '2-3 jours ouvrables'}
              </span>
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Historique
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Commande passée</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.date}</p>
              </div>
            </div>
            {order.status !== 'En attente' && (
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">En préparation</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 1 jour</p>
                </div>
              </div>
            )}
            {order.status === 'Livré' && (
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Livré</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Aujourd'hui</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}
