'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { getTranslation } from '@/lib/i18n';
import { useStoredLocale } from '@/lib/useLocale';
import { useCart } from './CartContext';

interface Line { id: number; name: string; brand: string; price: number; image: string; qty: number; }

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const [locale] = useStoredLocale();
  const t = getTranslation(locale);
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || items.length === 0) { if (items.length === 0) setLines([]); return; }
    setLoading(true);
    Promise.all(items.map(async (it) => {
      try {
        const res = await fetch(`/api/products/${it.product_id}`);
        const json = await res.json();
        const p = json.data;
        return { id: it.product_id, name: p.name, brand: p.brand, price: Number(p.price), image: p.image, qty: it.quantity } as Line;
      } catch { return null; }
    })).then((r) => { setLines(r.filter(Boolean) as Line[]); setLoading(false); });
  }, [isOpen, items]);

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-ink/50 transition-opacity ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 bottom-0 right-0 z-[100] w-[min(420px,92vw)] bg-cream border-l border-[#E2D6C3] flex flex-col transition-transform duration-500 ${isOpen ? '' : 'translate-x-full'}`}
        role="dialog" aria-label={t.cart.title}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2D6C3]">
          <h2 className="font-serif text-[28px]">{t.cart.title}</h2>
          <button onClick={closeCart} className="text-xs tracking-[0.14em] uppercase p-2" aria-label={t.cart.close}>{t.cart.close}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {lines.length === 0 && !loading && (
            <p className="text-center text-[#6E6259] font-light mt-16">{t.cart.empty}<br /><span className="text-sm">{t.cart.emptySub}</span></p>
          )}
          {loading && <p className="text-center text-[#6E6259] mt-16 text-sm">{t.cart.loading}</p>}
          {lines.map((l) => (
            <div key={l.id} className="flex gap-3 bg-white border border-[#E2D6C3] p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.image} alt="" className="w-14 h-[70px] object-cover bg-[#F3ECE1]" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.18em] uppercase text-gold">{l.brand}</p>
                <p className="font-serif text-lg leading-tight truncate">{l.name}</p>
                <p className="text-sm text-[#6E6259]">{formatPrice(l.price)} {t.products.priceSuffix}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button onClick={() => updateQuantity(l.id, l.qty - 1)} className="w-7 h-7 border border-[#E2D6C3]" aria-label="−">−</button>
                  <span className="text-sm">{l.qty}</span>
                  <button onClick={() => updateQuantity(l.id, l.qty + 1)} className="w-7 h-7 border border-[#E2D6C3]" aria-label="+">+</button>
                  <button onClick={() => removeItem(l.id)} className="ml-auto text-xs text-primary-600 underline">{t.cart.remove}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-[#E2D6C3] bg-white">
          <div className="h-[3px] bg-[#EFE6D8] mb-3"><i className="block h-full bg-primary-600 transition-all" style={{ width: `${Math.min(100, (subtotal / 6000) * 100)}%` }} /></div>
          <p className="text-[13px] text-[#6E6259] mb-3">{subtotal >= 6000 ? t.cart.freeDone : `${t.cart.freeMore} ${formatPrice(6000 - subtotal)} ${t.products.priceSuffix}`}</p>
          <p className="flex justify-between mb-4">{t.cart.subtotal} <strong className="font-serif text-2xl">{formatPrice(subtotal)} {t.products.priceSuffix}</strong></p>
          <a href="/checkout" onClick={closeCart} className="btn-luxe-solid w-full">{t.cart.order}</a>
        </div>
      </aside>
    </>
  );
}
