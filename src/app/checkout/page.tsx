'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Locale, getTranslation, getDir, getStoredLocale, setStoredLocale, localeNames, locales } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/CartContext';
import { Button } from '@/components/ui/Button';

const wilayas = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'Msila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane',
  'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', "El M'Ghair", 'El Meniaa',
];

interface CartProduct { id: number; name: string; brand: string; price: number; image: string; stock: number; }

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [locale, setLocale] = useState<Locale>('fr');
  useEffect(() => { setLocale(getStoredLocale()); }, []);
  const change = (l: Locale) => { setLocale(l); setStoredLocale(l); };
  const t = getTranslation(locale);
  const dir = getDir(locale);

  const [products, setProducts] = useState<Record<number, CartProduct>>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [formData, setFormData] = useState({
    customer_name: '', customer_phone: '', customer_wilaya: '', customer_address: '', customer_notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (items.length === 0) { setLoadingProducts(false); return; }
      setLoadingProducts(true);
      try {
        const entries = await Promise.all(items.map(async (it) => {
          const res = await fetch(`/api/products/${it.product_id}`);
          if (!res.ok) return null;
          const json = await res.json();
          const p = json.data;
          return [it.product_id, {
            id: p.id, name: p.name, brand: p.brand,
            price: Number(p.price), image: p.image, stock: p.stock,
          }] as const;
        }));
        const map: Record<number, CartProduct> = {};
        entries.forEach(e => { if (e) map[e[0]] = e[1]; });
        setProducts(map);
      } catch { /* keep empty */ }
      finally { setLoadingProducts(false); }
    };
    load();
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = items.reduce((s, it) => s + (products[it.product_id]?.price || 0) * it.quantity, 0);
  const shippingCost = subtotal === 0 || subtotal >= 6000 ? 0 : 500;
  const total = subtotal + shippingCost;

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.customer_name.trim()) e.customer_name = t.checkout.reqName;
    if (!/^(\+213|0)(5|6|7)[0-9]{8}$/.test(formData.customer_phone.replace(/[\s-]/g, '')))
      e.customer_phone = t.checkout.reqPhone;
    if (!formData.customer_wilaya) e.customer_wilaya = t.checkout.reqWilaya;
    if (!formData.customer_address.trim()) e.customer_address = t.checkout.reqAddress;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm() || items.length === 0) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error');
      setSubmitSuccess(true);
      clearCart();
      setTimeout(() => router.push(`/${locale}/order-success?order=${data.data.order_number}`), 1600);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (k: string) =>
    `w-full px-4 py-3 rounded-lg border border-[#E2D6C3] bg-white text-ink text-base ${errors[k] ? '!border-red-500' : ''}`;

  if (submitSuccess) {
    return (
      <div className="min-h-[70dvh] flex items-center justify-center bg-cream py-12" dir={dir}>
        <div className="text-center px-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl mb-2">{t.checkout.successTitle}</h1>
          <p className="text-[#6E6259]">{t.checkout.successSub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 pb-28 lg:pb-12" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <h1 className="font-serif font-medium text-3xl sm:text-4xl">{t.checkout.title} <span className="text-[#6E6259] text-lg font-sans font-light">{t.checkout.subtitle}</span></h1>
          <div className="flex gap-2" role="group" aria-label="Language">
            {locales.map((l) => (
              <button key={l} onClick={() => change(l)}
                className={`px-4 py-2 text-sm border ${locale === l ? 'bg-ink text-cream border-ink' : 'border-[#E2D6C3] text-[#6E6259]'}`}>
                {localeNames[l] === 'FR' ? 'Français' : 'العربية'}
              </button>
            ))}
          </div>
        </div>

        {submitError && (
          <div className="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{submitError}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl border border-[#E2D6C3] p-5 sm:p-7 shadow-card space-y-4">
            <h2 className="font-serif text-2xl">{t.checkout.step1}</h2>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="cn">{t.checkout.name}</label>
              <input id="cn" className={inputCls('customer_name')} placeholder={t.checkout.namePh}
                value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} />
              {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="cp">{t.checkout.phone}</label>
              <input id="cp" type="tel" inputMode="tel" autoComplete="tel" className={inputCls('customer_phone')}
                placeholder={t.checkout.phonePh} value={formData.customer_phone}
                onChange={e => setFormData({ ...formData, customer_phone: e.target.value })} />
              {errors.customer_phone && <p className="text-xs text-red-500 mt-1">{errors.customer_phone}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="cw">{t.checkout.wilaya}</label>
                <select id="cw" className={inputCls('customer_wilaya')} value={formData.customer_wilaya}
                  onChange={e => setFormData({ ...formData, customer_wilaya: e.target.value })}>
                  <option value="">{t.checkout.wilayaPh}</option>
                  {wilayas.map((w, i) => <option key={w} value={w}>{i + 1} — {w}</option>)}
                </select>
                {errors.customer_wilaya && <p className="text-xs text-red-500 mt-1">{errors.customer_wilaya}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="ca">{t.checkout.address}</label>
                <textarea id="ca" rows={2} className={inputCls('customer_address')} placeholder={t.checkout.addressPh}
                  value={formData.customer_address} onChange={e => setFormData({ ...formData, customer_address: e.target.value })} />
                {errors.customer_address && <p className="text-xs text-red-500 mt-1">{errors.customer_address}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="cno">{t.checkout.notes}</label>
              <textarea id="cno" rows={2} className="w-full px-4 py-3 rounded-lg border border-[#E2D6C3] bg-white text-base"
                placeholder={t.checkout.notesPh} value={formData.customer_notes}
                onChange={e => setFormData({ ...formData, customer_notes: e.target.value })} />
            </div>

            <h2 className="font-serif text-2xl pt-2">{t.checkout.step2}</h2>
            <div className="p-4 bg-cream rounded-lg text-sm flex items-center gap-3 border border-[#E2D6C3]">
              <span className="px-2 py-1 rounded bg-ink text-cream text-[11px] font-bold">COD</span>
              <span>{t.checkout.codTitle}<br /><span className="text-[#6E6259]">{t.checkout.codDesc}</span></span>
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting} className="py-4 text-base">
              {isSubmitting ? t.checkout.sending : items.length === 0 ? t.checkout.emptyCart : `${t.checkout.submit} — ${formatPrice(total)} ${t.products.priceSuffix}`}
            </Button>
            <p className="text-xs text-[#6E6259] text-center">{t.checkout.consent}</p>
          </form>

          <aside className="bg-white rounded-2xl border border-[#E2D6C3] p-5 sm:p-6 shadow-card lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl mb-4">{t.checkout.cartTitle} ({items.length})</h2>
            {loadingProducts ? (
              <p className="text-sm text-[#6E6259] flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t.cart.loading}</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-[#6E6259]">{t.checkout.emptyCart} <a href="/" className="underline">{t.checkout.backToShop}</a></p>
            ) : (
              <div className="space-y-3 mb-4">
                {items.map(it => {
                  const p = products[it.product_id];
                  return (
                    <div key={it.product_id} className="flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p?.image || '/images/hero-lipstick.jpg'} alt=""
                        className="w-14 h-14 rounded-lg object-cover bg-[#F3ECE1] border border-[#E2D6C3]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gold uppercase tracking-wider">{p?.brand || '…'}</p>
                        <p className="text-sm font-medium truncate">{p?.name || `#${it.product_id}`}</p>
                        <p className="text-sm text-[#6E6259]">× {it.quantity} — {p ? `${formatPrice(p.price * it.quantity)} ${t.products.priceSuffix}` : '…'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="space-y-1.5 text-sm border-t border-[#E2D6C3] pt-3">
              <div className="flex justify-between text-[#6E6259]"><span>{t.cart.subtotal}</span><span>{formatPrice(subtotal)} {t.products.priceSuffix}</span></div>
              <div className="flex justify-between text-[#6E6259]"><span>{t.checkout.shipping}</span><span>{shippingCost === 0 ? t.checkout.freeShip : `${formatPrice(shippingCost)} ${t.products.priceSuffix}`}</span></div>
              {subtotal > 0 && subtotal < 6000 && (
                <p className="text-xs text-amber-700">{t.cart.freeMore} {formatPrice(6000 - subtotal)} {t.products.priceSuffix} {t.checkout.moreForFree}</p>
              )}
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-[#E2D6C3]"><span>{t.checkout.total}</span><span>{formatPrice(total)} {t.products.priceSuffix}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
