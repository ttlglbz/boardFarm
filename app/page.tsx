'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface HomeStats {
  totalUsers: number;
  totalRenders: number;
  activeNodes: number;
  averageRenderTime: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeStats() {
      try {
        const res = await fetch('/api/stats/home');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeStats();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Dağıtık Render Farm Çözümü
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              BoardFarm ile render işlemlerinizi hızlandırın. Güçlü node ağımız ve kullanıcı dostu arayüzümüz ile projelerinizi daha hızlı tamamlayın.
            </p>
            <div className="flex gap-4">
              {!session ? (
                <>
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Ücretsiz Başla
                  </Link>
                  <Link
                    href="/login"
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Giriş Yap
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Dashboard'a Git
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Kullanıcı</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      stats?.totalUsers || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CloudArrowUpIcon className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Render</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      stats?.totalRenders || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Node</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      stats?.activeNodes || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Süre</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      stats?.averageRenderTime || '0s'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Neden BoardFarm?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <CpuChipIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Dağıtık Render</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Projelerinizi birden fazla node üzerinde paralel olarak render edin, zamandan tasarruf edin.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <CloudArrowUpIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Kolay Kullanım</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kullanıcı dostu arayüz ile projelerinizi kolayca yükleyin ve yönetin.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <ChartBarIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Detaylı İstatistikler</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Render süreçlerinizi takip edin, performans analizleri ile işlerinizi optimize edin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            Hemen Başlayın
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            BoardFarm ile render işlemlerinizi hızlandırın. Ücretsiz hesap oluşturun ve hemen kullanmaya başlayın.
          </p>
          {!session ? (
            <Link
              href="/register"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              Ücretsiz Hesap Oluştur
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/upload"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              Yeni Proje Yükle
              <CloudArrowUpIcon className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
} 