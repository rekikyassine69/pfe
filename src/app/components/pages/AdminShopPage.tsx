import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Package, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { api } from '@/app/services/api';
import { AddProductModal } from '@/app/components/modals/AddProductModal';
import { EditProductModal } from '@/app/components/modals/EditProductModal';
import { DeleteConfirmModal } from '@/app/components/modals/DeleteConfirmModal';

interface ProductItem {
  id: string;
  nom: string;
  description?: string;
  categorie?: string;
  prix?: number;
  quantiteStock?: number;
  imageUrl?: string;
  statut?: 'disponible' | 'rupture' | 'bientôt';
  marque?: string;
  estBestseller?: boolean;
  note?: number;
  specifications?: {
    capteurs?: string[];
    connectivite?: string;
  };
}

const getId = (product: any) => product?._id?.$oid ?? product?._id ?? product?.idProduit ?? '';

const statusLabel = (value?: string) => {
  if (value === 'rupture') return 'Rupture';
  if (value === 'bientôt') return 'Bientot';
  return 'Disponible';
};

const statusBadge = (value?: string) => {
  if (value === 'rupture') return 'bg-red-500/20 text-red-600';
  if (value === 'bientôt') return 'bg-orange-500/20 text-orange-600';
  return 'bg-green-500/20 text-green-600';
};

export function AdminShopPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.adminFetchCollection('produits', { sort: 'createdAt', order: 'desc', limit: 200 });
      const mapped = (data || []).map((product: any) => ({
        id: String(getId(product)),
        nom: product.nom || 'Produit',
        description: product.description,
        categorie: product.categorie,
        prix: product.prix,
        quantiteStock: product.quantiteStock ?? 0,
        imageUrl: product.imageUrl,
        statut: product.statut,
        marque: product.marque,
        estBestseller: Boolean(product.estBestseller),
        note: product.note,
        specifications: product.specifications,
      }));
      setProducts(mapped);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast.error(error.message || 'Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => (p.quantiteStock ?? 0) > 0).length;
    const lowStock = products.filter((p) => (p.quantiteStock ?? 0) > 0 && (p.quantiteStock ?? 0) <= 5).length;
    const outStock = products.filter((p) => (p.quantiteStock ?? 0) === 0).length;
    return [
      { label: 'Total Produits', value: String(total), icon: Package, color: 'text-chart-1' },
      { label: 'En stock', value: String(inStock), icon: CheckCircle2, color: 'text-green-500' },
      { label: 'Stock faible', value: String(lowStock), icon: AlertTriangle, color: 'text-orange-500' },
      { label: 'Rupture', value: String(outStock), icon: XCircle, color: 'text-red-500' },
    ];
  }, [products]);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.categorie)
      .filter(Boolean)
      .map((value) => String(value));
    const unique = Array.from(new Set(values));
    return ['tous', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !term ||
        product.nom?.toLowerCase().includes(term) ||
        product.categorie?.toLowerCase().includes(term) ||
        product.marque?.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === 'tous' || product.categorie === categoryFilter;
      const matchesStatus = statusFilter === 'tous' || product.statut === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleAddProduct = async (product: Omit<ProductItem, 'id'>) => {
    try {
      await api.adminCreateCollectionItem('produits', product);
      toast.success(`Produit "${product.nom}" ajoute`);
      await loadProducts();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Erreur lors de la creation du produit');
    }
  };

  const handleEditProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (id: string, updates: Omit<ProductItem, 'id'>) => {
    try {
      await api.adminUpdateCollectionItem('produits', id, updates);
      toast.success(`Produit "${updates.nom}" mis a jour`);
      setShowEditModal(false);
      setSelectedProduct(null);
      await loadProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Erreur lors de la mise a jour du produit');
    }
  };

  const handleDeleteProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await api.adminDeleteCollectionItem('produits', selectedProduct.id);
      toast.success(`Produit "${selectedProduct.nom}" supprime`);
      setSelectedProduct(null);
      await loadProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Gestion Boutique</h1>
          <p className="text-muted-foreground mt-1">Ajoutez, modifiez et supprimez les produits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
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

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, categorie ou marque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'tous' ? 'Toutes categories' : category}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="tous">Tous statuts</option>
              <option value="disponible">Disponible</option>
              <option value="rupture">Rupture</option>
              <option value="bientôt">Bientot</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Produit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Categorie</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Prix</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Specs</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Avis</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.nom} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.nom}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.categorie || '—'}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{(product.prix || 0).toFixed(2)}€</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.quantiteStock ?? 0}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    <div>{product.specifications?.capteurs?.length ? `Capteurs: ${product.specifications.capteurs.join(', ')}` : 'Capteurs: —'}</div>
                    <div>{product.specifications?.connectivite ? `Conn: ${product.specifications.connectivite}` : 'Conn: —'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {typeof product.note === 'number' ? `${product.note.toFixed(1)}/5` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(product.statut)}`}>
                      {statusLabel(product.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                        aria-label="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">Aucun produit trouve.</div>
        )}
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
      />
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={selectedProduct}
        onUpdate={handleUpdateProduct}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Supprimer le produit"
        message="Cette action supprimera definitivement le produit de la boutique."
        itemName={selectedProduct?.nom}
      />
    </div>
  );
}
