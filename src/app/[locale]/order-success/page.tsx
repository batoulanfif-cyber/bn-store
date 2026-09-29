'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Locale, getDir } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

// NOTE: Next.js 14 passes `params` as a plain object (not a Promise).
// Do NOT use React's `use()` here — it throws on Next 14 and the customer
// sees an error page right after their confirmed order.
export default function OrderSuccessPage({ params }: { params: { locale: Locale } }) {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-[#6E6259]">…</div>}>
      <SuccessInner locale={params.locale} />
    </Suspense>
  );
}

function SuccessInner({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const dir = getDir(locale);
  const ar = locale === 'ar';

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12 px-4 pb-28 lg:pb-12" dir={dir}>
      <div className="max-w-md w-full mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-ink mb-2">{ar ? 'تم تأكيد طلبك!' : 'Commande confirmée !'}</h1>
        <p className="text-[#6E6259] mb-6">
          {ar ? 'شكراً لك. سنتصل بك قريباً لتأكيد التوصيل (الدفع نقداً).' : 'Merci pour votre commande. On vous appellera très vite pour confirmer la livraison (paiement cash).'}
        </p>
        {orderNumber && (
          <div className="bg-white p-4 rounded-lg border border-[#E2D6C3] mb-6">
            <p className="text-xs text-[#6E6259] mb-1">{ar ? 'رقم الطلب' : 'N° de commande'}</p>
            <p className="font-mono font-semibold text-ink">{orderNumber}</p>
            <p className="text-xs text-[#6E6259] mt-2">{ar ? 'احتفظ بهذا الرقم — سيطلبه منك موظف التوصيل.' : 'Gardez ce numéro — le livreur vous le demandera.'}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => (window.location.href = '/')} variant="primary">
            {ar ? 'مواصلة التسوق' : 'Continuer mes achats'}
          </Button>
          <Button onClick={() => (window.location.href = '/products')} variant="secondary">
            {ar ? 'عرض المنتجات' : 'Voir les produits'}
          </Button>
        </div>
      </div>
    </div>
  );
}
