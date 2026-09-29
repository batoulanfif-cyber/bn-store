'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Package } from 'lucide-react';
import { getDir } from '@/lib/i18n';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ProductFormModal, ProductFormValues } from '@/components/admin/ProductFormModal';

interface ProductAdmin {
  id: number;
  brand: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  image: string;
  rating: number;
  review_count: number;
  badge: string | null;
  is_active: boolean;
  is_featured: boolean;
  category: string | null;
  created_at: string;
}

export default function AdminProductsPage() {
  const dir = getDir('fr');
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductFormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (debounced) params.append('search', debounced);
      if (filterActive === 'active') params.append('active', 'true');
      if (filterActive === 'inactive') params.append('active', 'false');
      if (filterCategory) params.append('category', filterCategory);

      const res = await fetch(`/api/products?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Impossible de charger les produits');
      const data = await res.json();
      setProducts(data.data?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [debounced, filterActive, filterCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: ProductAdmin) => {
    setEditing({
      id: p.id, brand: p.brand, name: p.name, slug: p.slug,
      description: p.description || '', price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '',
      stock: String(p.stock), image: p.image,
      category: p.category || 'levres', badge: p.badge || '',
      is_active: !!p.is_active, is_featured: !!p.is_featured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (v: ProductFormValues) => {
    if (!v.brand.trim() || !v.name.trim() || !v.slug.trim() || !v.price || !v.image.trim()) {
      setError('Marque, nom, slug, prix et photo sont obligatoires.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        brand: v.brand.trim(), name: v.name.trim(), slug: v.slug.trim(),
        description: v.description.trim() || null,
        price: Number(v.price), original_price: v.original_price ? Number(v.original_price) : null,
        stock: Number(v.stock) || 0, image: v.image.trim(),
        category: v.category || null, badge: v.badge.trim() || null,
        is_active: v.is_active, is_featured: v.is_featured,
      };
      const url = v.id ? `/api/products/${v.id}` : '/api/products';
      const res = await fetch(url, {
        method: v.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Enregistrement impossible');
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer « ${name} » ?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Suppression impossible');
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (p: ProductAdmin) => {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ is_active: !p.is_active }),
      });
      fetchProducts();
    } catch { setError('Mise à jour impossible'); }
  };

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Produits</h1>
          <p className="text-gray-600 mt-1">{products.length} produit(s) — ajout, modification, suppression</p>
        </div>
        <Button onClick={openAdd} className="self-start">
          <Plus className="w-4 h-4" /> Ajouter un produit
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between text-sm" role="alert">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold px-2">×</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher (nom, marque)…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div className="flex items-center gap-2">
            <select value={filterActive} onChange={e => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2.5 rounded-lg border text-sm">
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Masqués</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2.5 rounded-lg border text-sm">
              <option value="">Catégories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Chargement…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold mb-1">Aucun produit</h3>
            <p className="text-gray-500 text-sm mb-4">Ajoutez votre premier rouge.</p>
            <Button onClick={openAdd} className="mx-auto"><Plus className="w-4 h-4" /> Ajouter</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-gray-50 border-b text-left text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover border bg-gray-100" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.name}</p>
                          <p className="text-xs text-gray-500 truncate">{p.brand} • {p.slug} • {p.category || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{formatPrice(Number(p.price))} DA</p>
                      {p.original_price && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(Number(p.original_price))} DA</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {p.stock}
                      {p.stock === 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded">Rupture</span>}
                      {p.stock > 0 && p.stock <= 5 && <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-yellow-100 text-yellow-700 rounded">Bas</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(p)}
                        className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
                          p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                        <span className={cn('w-2 h-2 rounded-full', p.is_active ? 'bg-green-500' : 'bg-gray-400')} />
                        {p.is_active ? 'Actif' : 'Masqué'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} title="Modifier"
                          className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting === p.id} title="Supprimer"
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50">
                          {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductFormModal open={modalOpen} initial={editing} saving={saving}
        error={null} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
