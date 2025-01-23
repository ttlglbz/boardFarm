"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  UserIcon,
  KeyIcon,
  BellIcon,
  CpuChipIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface UserProfile {
  username: string;
  email: string;
  profilePhoto: string;
  credits: number;
  totalRenders: number;
  successRate: number;
  activeNodes: number;
}

export default function Settings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Form states
  const [email, setEmail] = useState("");
  const [pfp, setPfp] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [renderPriority, setRenderPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [notifications, setNotifications] = useState({
    onComplete: true,
    onFail: true,
    onStart: false,
  });

  const tabs = [
    { id: "profile", name: "Profil Ayarları", icon: UserIcon },
    { id: "password", name: "Şifre", icon: KeyIcon },
    { id: "render", name: "Render Tercihleri", icon: CpuChipIcon },
    { id: "notifications", name: "Bildirimler", icon: BellIcon },
    { id: "blacklist", name: "Kara Liste", icon: NoSymbolIcon },
    { id: "keys", name: "Render Anahtarları", icon: KeyIcon },
  ];

  // Profil verilerini yükle
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get('/api/profile/damn');
        const userData = response.data;
        setProfile(userData);
        setEmail(userData.email);
        setRenderPriority(userData.settings?.renderPreferences?.priority || 'normal');
        setNotifications(userData.settings?.notifications || {
          onComplete: true,
          onFail: true,
          onStart: false,
        });
      } catch (error) {
        toast.error('Profil bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      loadProfile();
    }
  }, [session]);

  // Profil fotoğrafı güncelleme
  const handlePfpUpdate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/damn/pfp', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('API yanıtı:', data);

      if (data.success && data.photoUrl) {
        setProfile(prev => {
          if (!prev) return null;
          return {
            ...prev,
            profilePhoto: data.photoUrl
          };
        });
        toast.success('Profil fotoğrafı güncellendi');
      } else {
        console.error('Profil fotoğrafı güncellenemedi:', data.error);
        toast.error(data.error || 'Profil fotoğrafı güncellenemedi');
      }
    } catch (error) {
      console.error('Profil fotoğrafı yükleme hatası:', error);
      toast.error('Profil fotoğrafı yüklenirken bir hata oluştu');
    }
  };

  const handlePfpDelete = async () => {
    try {
      const response = await fetch('/api/profile/damn/pfp', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setProfile(prev => {
          if (!prev) return null;
          return {
            ...prev,
            profilePhoto: '/images/pfp/duck.jpg'
          };
        });
        toast.success('Profil fotoğrafı silindi');
      } else {
        toast.error(data.error || 'Profil fotoğrafı silinemedi');
      }
    } catch (error) {
      console.error('Profil fotoğrafı silme hatası:', error);
      toast.error('Profil fotoğrafı silinirken bir hata oluştu');
    }
  };

  // Email güncelleme
  const handleEmailUpdate = async () => {
    try {
      // Email formatını kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Geçerli bir email adresi giriniz');
        return;
      }

      const response = await axios.put('/api/profile/damn', { email });
      
      if (response.data.user) {
        setProfile(prev => ({
          ...prev!,
          email: response.data.user.email
        }));
        toast.success('Email güncellendi');
      } else {
        toast.error('Email güncellenemedi');
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Email güncellenemedi');
      }
    }
  };

  // Şifre güncelleme
  const handlePasswordUpdate = async () => {
    try {
      // Şifreleri kontrol et
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error('Tüm alanları doldurunuz');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('Yeni şifreler eşleşmiyor');
        return;
      }

      if (newPassword.length < 8) {
        toast.error('Yeni şifre en az 8 karakter olmalıdır');
        return;
      }

      // API'ye gönder
      const response = await fetch('/api/profile/damn', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Şifre başarıyla güncellendi');
        // Formu temizle
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Şifre güncellenemedi');
      }
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      toast.error('Şifre güncellenirken bir hata oluştu');
    }
  };

  // Render tercihlerini güncelleme
  const handleRenderPreferencesUpdate = async () => {
    try {
      await axios.put('/api/profile/damn', {
        settings: {
          renderPreferences: {
            priority: renderPriority,
          },
        },
      });
      toast.success('Render tercihleri güncellendi');
    } catch (error) {
      toast.error('Render tercihleri güncellenemedi');
    }
  };

  // Bildirim ayarlarını güncelleme
  const handleNotificationUpdate = async () => {
    try {
      await axios.put('/api/profile/damn', {
        settings: {
          notifications,
        },
      });
      toast.success('Bildirim ayarları güncellendi');
    } catch (error) {
      toast.error('Bildirim ayarları güncellenemedi');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Ayarlar</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Hesap ve render tercihlerinizi yönetin
        </p>
      </div>

      <div className="grid grid-cols-[300px,1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary dark:text-primary-light"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl w-full p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Profil Ayarları
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profil Fotoğrafı
                  </label>
                  <div className="flex items-center gap-4">
                    <img 
                      src={profile?.profilePhoto || '/images/pfp/duck.jpg'} 
                      alt="Profil" 
                      className="w-20 h-20 rounded-full"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePfpUpdate(file);
                        }
                      }}
                      className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={handleEmailUpdate}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Güncelle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Şifre Değiştir
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={handlePasswordUpdate}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Şifreyi Güncelle
                </button>
              </div>
            </div>
          )}

          {activeTab === "render" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Render Tercihleri
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Öncelik
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priority"
                        className="text-primary"
                      />
                      <span className="dark:text-white">Normal</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priority"
                        className="text-primary"
                      />
                      <span className="dark:text-white">Yüksek</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priority"
                        className="text-primary"
                      />
                      <span className="dark:text-white">Düşük</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Bildirim Ayarları
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="text-primary rounded" />
                  <span className="dark:text-white">
                    Render tamamlandığında bildir
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="text-primary rounded" />
                  <span className="dark:text-white">
                    Render başarısız olduğunda bildir
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="text-primary rounded" />
                  <span className="dark:text-white">
                    Yeni render başladığında bildir
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "blacklist" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Kara Liste
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Engellenmiş Renderlar
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      Henüz engellenmiş render yok
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Engellenmiş Kullanıcılar
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      Henüz engellenmiş kullanıcı yok
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "keys" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Render Anahtarları
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium dark:text-white">
                        Ana Render Anahtarı
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Oluşturulma: 1 ay önce
                      </p>
                    </div>
                    <button className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                      Sil
                    </button>
                  </div>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  Yeni Anahtar Oluştur
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
