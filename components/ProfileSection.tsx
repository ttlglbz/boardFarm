"use client";

import {
  UserCircleIcon,
  CloudArrowUpIcon,
  ClockIcon,
  FolderIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserProfile {
  username: string;
  email: string;
  profilePhoto: string;
  credits: number;
  totalRenders: number;
  successRate: number;
  activeNodes: number;
}

export default function ProfileSection() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentRenders, setRecentRenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/users/profile');
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

    if (session) {
      fetchProfile();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-4">
      {/* Profil Başlığı */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
          {profile?.profilePhoto ? (
            <img 
              src={profile.profilePhoto} 
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          )}
        </div>
        <div>
          <h2 className="font-semibold dark:text-white">{profile?.username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
        </div>
      </div>

      {/* Kullanıcı İstatistikleri */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Krediler</p>
            <p className="font-semibold dark:text-white">{profile?.credits}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Render</p>
            <p className="font-semibold dark:text-white">{profile?.totalRenders}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Başarı Oranı</p>
            <p className="font-semibold dark:text-white">{profile?.successRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Node</p>
            <p className="font-semibold dark:text-white">{profile?.activeNodes}</p>
          </div>
        </div>
      </div>

      {/* Hızlı Erişim */}
      <div className="space-y-1 mb-6">
        <Link href="/upload" className="flex items-center gap-3 px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <CloudArrowUpIcon className="w-5 h-5" />
          <span>Yeni Yükleme</span>
        </Link>
        <Link href="/my-farm" className="flex items-center gap-3 px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <CpuChipIcon className="w-5 h-5" />
          <span>Node Yönetimi</span>
        </Link>
      </div>

      {/* Logout Button */}
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="mt-4 w-full flex items-center gap-3 px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        <span>Çıkış Yap</span>
      </button>
    </div>
  );
}
