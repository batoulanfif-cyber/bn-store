'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Upload } from 'lucide-react';

export interface ProductFormValues {
  id?: number;
  brand: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  stock: string;
  image: string;
  category: string;
  badge: string;
  is_active: boolean;
  is_featured: boolean;
}

const EMPTY: ProductFormValues = {
  brand: '', name: '', slug: '', description: '',
  price: '', original_price: '', stock: '10',
  image: '', category: 'levres', badge: '',
  is_active: true, is_featured: false,
};

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

export function ProductFormModal({
  open, initial, saving, error, onClose, onSubmit,
}: {
  open: boolean;
  initial: ProductFormValues | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (v: ProductFormValues) => void;
}) {
  const [form, setForm] = useState<ProductFormValues>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ?? EMPTY);
      setSlugTouched(!!initial);
    }
  }, [open, initial]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k: keyof ProductFormValues, v: string | boolean) =>
    setForm(f => {
      const next = { ...f, [k]: v };
      if ((k === 'name' || k === 'brand') && !slugTouched) {
        next.slug = slugify(`${next.brand} ${next.name}`.trim());
      }
      return next;
    });

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
      setForm(f => ({ ...f, image: data.data.url }));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl max-h-[92dvh] overflow-y-auto p-5 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl">{form.id ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <p className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-sm">Marque *
            <input value={form.brand} onChange={e => set('brand', e.target.value)}
              placeholder="BN" className="mt-1 w-full px-3 py-2.5 border rounded-lg" />
          </label>
          <label className="text-sm">Nom *
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Rouge Opéra N° I" className="mt-1 w-full px-3 py-2.5 border rounded-lg" />
          </label>
          <label className="text-sm sm:col-span-2">Slug *
            <input value={form.slug} onChange={e => { setSlugTouched(true); set('slug', slugify(e.target.value)); }}
              placeholder="rouge-opera-n1" className="mt-1 w-full px-3 py-2.5 border rounded-lg font-mono text-[13px]" />
          </label>
          <label className="text-sm sm:col-span-2">Description
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              placeholder="Fini satin, tenue 8h, karité…" className="mt-1 w-full px-3 py-2.5 border rounded-lg" />
          </label>
          <label className="text-sm">Prix (DA) *
            <input type="number" min="0" step="1" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="4500" className="mt-1 w-full px-3 py-2.5 border rounded-lg" />
          </label>
          <label className="text-sm">Ancien prix (promo)
            <input type="number" min="0" step="1" value={form.original_price} onChange={e => set('original_price', e.target.value)}
              placeholder="5200" className="mt-1 w-full px-3 py-2.5 border rounded-lg" />
          </label>
          <label className="text-sm">Stock *
            <input type="number" min="0" step="1" value={form.stock} onChange={e => set('stock', e.target.value)}
              className="mt-1 w-full px-3 py-2.5 border rounded-lg" />
          </label>
          <label className="text-sm">Catégorie
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="mt-1 w-full px-3 py-2.5 border rounded-lg">
              <option value="levres">Lèvres</option>
              <option value="teint">Teint</option>
              <option value="yeux">Yeux</option>
              <option value="soins">Soins</option>
              <option value="parfums">Parfums</option>
            </select>
          </label>
          <label className="text-sm sm:col-span-2">Badge
            <input value={form.badge} onChange={e => set('badge', e.target.value)}
              placeholder="BEST SELLER / Nouveau / -20%" className="mt-1 w-full px-3 py-2.5 border rounded-lg" />
          </label>

          <div className="sm:col-span-2">
            <p className="text-sm mb-1">Photo *</p>
            <div className="flex gap-3 items-start">
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="" className="w-20 h-20 rounded-lg object-cover border" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 border grid place-items-center text-gray-400 text-xs">Aperçu</div>
              )}
              <div className="flex-1">
                <input value={form.image} onChange={e => set('image', e.target.value)}
                  placeholder="https://… ou /uploads/….jpg" className="w-full px-3 py-2.5 border rounded-lg text-[13px]" />
                <label className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm cursor-pointer">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Envoi…' : 'Depuis le téléphone'}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </label>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4" />
            Visible en boutique
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-4 h-4" />
            Mettre en avant
          </label>
        </div>

        <div className="flex gap-3 mt-6 sticky bottom-0 bg-white pt-3 pb-1">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border text-sm">Annuler</button>
          <button
            disabled={saving || uploading}
            onClick={() => onSubmit(form)}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {form.id ? 'Enregistrer' : 'Ajouter le produit'}
          </button>
        </div>
      </div>
    </div>
  );
}
