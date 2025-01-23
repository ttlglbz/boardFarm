'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CpuChipIcon,
  DocumentIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ComputerDesktopIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  status: 'rendering' | 'completed' | 'failed' | 'queued';
  progress: number;
  createdAt: string;
  frames: number;
  renderTime: string;
}

interface Node {
  id: string;
  name: string;
  status: string;
  currentJob?: {
    id: string;
    name: string;
    progress: number;
  };
}

interface DashboardStats {
  totalRenders: number;
  activeRenders: number;
  averageRenderTime: string;
  successRate: number;
  projects: Project[];
  nodes: Node[];
  totalProjects: number;
  totalNodes: number;
  activeNodes: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Render farm istatistikleriniz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <DocumentIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Render</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalRenders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Render</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.activeRenders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Süre</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.averageRenderTime}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Başarı Oranı</p>
              <p className="text-2xl font-bold dark:text-white">%{stats?.successRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Nodes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Aktif Node'lar</h2>
          {(!stats?.nodes || stats.nodes.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ComputerDesktopIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Henüz hiç node'unuz yok</p>
              <Link 
                href="/my-farm" 
                className="inline-flex items-center gap-2 text-primary dark:text-primary-dark hover:underline"
              >
                Start Rendering
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.nodes.map((node) => (
                <div 
                  key={node.id}
                  className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-medium dark:text-white">{node.name}</h3>
                      <p className={`text-sm ${
                        node.status === 'active' ? 'text-green-500' :
                        node.status === 'idle' ? 'text-blue-500' :
                        'text-gray-500'
                      }`}>
                        {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  {node.currentJob && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {node.currentJob.name}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${node.currentJob.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Site Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Site İstatistikleri</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Toplam Proje</p>
                <p className="text-2xl font-bold dark:text-white">{stats?.totalProjects}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Aktif Proje</p>
                <p className="text-2xl font-bold dark:text-white">{stats?.activeRenders}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Toplam Node</p>
                <p className="text-2xl font-bold dark:text-white">{stats?.totalNodes}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Aktif Node</p>
                <p className="text-2xl font-bold dark:text-white">{stats?.activeNodes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Projelerim</h2>
          {(!stats?.projects || stats.projects.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <DocumentIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Henüz hiç projen yok</p>
              <Link 
                href="/projects/new" 
                className="text-primary dark:text-primary-dark hover:underline"
              >
                İlk projeni yükle
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.projects.map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="font-medium dark:text-white">{project.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{project.progress}%</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      project.status === 'rendering' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                      project.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                      project.status === 'failed' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {project.status === 'rendering' ? 'Rendering' :
                       project.status === 'completed' ? 'Rendered' :
                       project.status === 'failed' ? 'Failed' :
                       'Queued'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Aktivite</h2>
          {/* ... Activity feed content ... */}
        </div>
      </div>
    </div>
  );
} 