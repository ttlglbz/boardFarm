'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  UserCircleIcon,
  CpuChipIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface UserProfileData {
  username: string;
  email: string;
  role: string;
  credits: number;
  totalRenders: number;
  successRate: number;
  activeNodes: number;
  joinDate: string;
  lastLogin: string;
  recentJobs: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    createdAt: string;
  }>;
  stats: {
    totalRenderTime: string;
    averageRenderTime: string;
    totalFrames: number;
    failedFrames: number;
  };
}

export default function UserProfile() {
  const { username } = useParams();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Profil yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Kullanıcı bulunamadı</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Bu kullanıcı adına sahip bir kullanıcı bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Profil Başlığı */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <UserCircleIcon className="w-16 h-16 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{profile.username}</h1>
          <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Katılım: {new Date(profile.joinDate).toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <CpuChipIcon className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Node</p>
              <p className="text-2xl font-bold dark:text-white">{profile.activeNodes}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <ClockIcon className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Render</p>
              <p className="text-2xl font-bold dark:text-white">{profile.totalRenders}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <ChartBarIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Başarı Oranı</p>
              <p className="text-2xl font-bold dark:text-white">{profile.successRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">₡</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Krediler</p>
              <p className="text-2xl font-bold dark:text-white">{profile.credits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detaylı İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Render İstatistikleri</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Render Süresi</p>
              <p className="text-lg font-medium dark:text-white">{profile.stats.totalRenderTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Render Süresi</p>
              <p className="text-lg font-medium dark:text-white">{profile.stats.averageRenderTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Frame</p>
              <p className="text-lg font-medium dark:text-white">{profile.stats.totalFrames}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Başarısız Frame</p>
              <p className="text-lg font-medium dark:text-white">{profile.stats.failedFrames}</p>
            </div>
          </div>
        </div>

        {/* Son İşler */}
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Son İşler</h2>
          <div className="space-y-4">
            {profile.recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium dark:text-white">{job.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {job.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 