'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  DocumentIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
} from '@heroicons/react/24/outline';

interface ProjectSettings {
  isAnimation: boolean;
  startFrame: number;
  endFrame: number;
  renderEngine: string;
  renderDevice: string;
  samples: number;
  resolution: {
    x: number;
    y: number;
    percentage: number;
  };
}

interface Project {
  _id: string;
  name: string;
  filename: string;
  status: string;
  uploadDate: string;
  filePath: string;
  settings: ProjectSettings;
}

interface ProjectClientProps {
  id: string;
}

export default function ProjectClient({ id }: ProjectClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ProjectSettings | null>(null);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setProject(data);
        setSettings(data.settings);
      } catch (error) {
        console.error('Proje yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email && id) {
      loadProject();
    }
  }, [session, id]);

  const handleSettingsUpdate = async () => {
    if (!settings || !id) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setProject(prev => prev ? { ...prev, settings } : null);
    } catch (error) {
      console.error('Ayar güncelleme hatası:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <DocumentIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold dark:text-white mb-2">Proje Bulunamadı</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            İstediğiniz proje bulunamadı veya erişim yetkiniz yok.
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="text-primary dark:text-primary-dark hover:underline"
          >
            Projelerime Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold dark:text-white">{project.name}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Render'ı Başlat
            </button>
          </div>
        </div>

        {/* Proje Bilgileri */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold dark:text-white mb-4">Proje Bilgileri</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dosya Adı</p>
              <p className="dark:text-white">{project.filename}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Yükleme Tarihi</p>
              <p className="dark:text-white">
                {new Date(project.uploadDate).toLocaleString('tr-TR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Durum</p>
              <p className="dark:text-white capitalize">{project.status}</p>
            </div>
          </div>
        </div>

        {/* Render Ayarları */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold dark:text-white mb-4">Render Ayarları</h2>
          {settings && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={settings.isAnimation}
                    onChange={(e) => setSettings(prev => prev ? {
                      ...prev,
                      isAnimation: e.target.checked
                    } : null)}
                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm dark:text-white">Animasyon</span>
                </label>
              </div>

              {settings.isAnimation && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Başlangıç Karesi
                    </label>
                    <input
                      type="number"
                      value={settings.startFrame}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        startFrame: parseInt(e.target.value)
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Bitiş Karesi
                    </label>
                    <input
                      type="number"
                      value={settings.endFrame}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        endFrame: parseInt(e.target.value)
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Render Motoru
                </label>
                <select
                  value={settings.renderEngine}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    renderEngine: e.target.value
                  } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="CYCLES">Cycles</option>
                  <option value="EEVEE">Eevee</option>
                  <option value="WORKBENCH">Workbench</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Render Cihazı
                </label>
                <select
                  value={settings.renderDevice}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    renderDevice: e.target.value
                  } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="GPU">GPU</option>
                  <option value="CPU">CPU</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Samples
                </label>
                <input
                  type="number"
                  value={settings.samples}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    samples: parseInt(e.target.value)
                  } : null)}
                  min="1"
                  max="4096"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Çözünürlük
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Genişlik
                    </label>
                    <input
                      type="number"
                      value={settings.resolution.x}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        resolution: {
                          ...prev.resolution,
                          x: parseInt(e.target.value)
                        }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Yükseklik
                    </label>
                    <input
                      type="number"
                      value={settings.resolution.y}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        resolution: {
                          ...prev.resolution,
                          y: parseInt(e.target.value)
                        }
                      } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Yüzde
                    </label>
                    <input
                      type="number"
                      value={settings.resolution.percentage}
                      onChange={(e) => setSettings(prev => prev ? {
                        ...prev,
                        resolution: {
                          ...prev.resolution,
                          percentage: parseInt(e.target.value)
                        }
                      } : null)}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSettingsUpdate}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
                >
                  Ayarları Kaydet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 