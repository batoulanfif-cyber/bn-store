'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Locale, getTranslation, getDir, locales, localeNames } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-gray-500">Chargement…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/dashboard';
  const [locale] = useState<Locale>('fr');
  const t = getTranslation(locale);
  const isRTL = locale === 'ar';
  const dir = getDir(locale);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12" dir={dir}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <span className="font-serif font-bold text-heading-lg text-gray-900">BN STORE</span>
            <span className="text-primary-600 text-caption font-medium tracking-wider">ADMIN</span>
          </Link>
          <h1 className="font-serif text-2xl text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Enter your credentials to access the dashboard</p>
        </div>

        <div className="bg-white rounded-card-lg p-6 sm:p-8 shadow-card">
          <div className="mb-6 flex justify-center" role="group" aria-label={t.common.language}>
            <select
              value={locale}
              onChange={e => router.push(`/admin/login?locale=${e.target.value}&redirect=${encodeURIComponent(redirect)}`)}
              className="appearance-none bg-gray-100 border-0 px-4 py-2.5 rounded-lg text-body-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              dir={dir}
            >
              {locales.map(l => (
                <option key={l} value={l}>{localeNames[l]}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-body-sm" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="admin@bnstore.dz"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-body-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="py-3.5">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-caption text-gray-500">
              Default credentials: admin@bnstore.dz / admin123
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-caption text-gray-500">
          <Link href={`/${locale}`} className="text-primary-600 hover:underline">
            ← Back to Store
          </Link>
        </p>
      </div>
    </div>
  );
}