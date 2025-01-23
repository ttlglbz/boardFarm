'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CpuChipIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface Node {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline' | 'maintenance';
  specs: {
    cpu: string;
    ram: string;
    gpu: string;
  };
  performance: {
    cpuUsage: number;
    ramUsage: number;
    temperature: number;
  };
  currentJob?: {
    id: string;
    name: string;
    progress: number;
  };
  lastSeen: string;
  totalRenders: number;
  uptime: string;
}

interface FarmStats {
  totalNodes: number;
  activeNodes: number;
  totalRenders: number;
  averageUptime: string;
  totalCredits: number;
}

export default function MyFarm() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [stats, setStats] = useState<FarmStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarmData() {
      try {
        // Node'ları getir
        const nodesRes = await fetch('/api/nodes');
        const nodesData = await nodesRes.json();
        setNodes(nodesData);

        // İstatistikleri getir
        const statsRes = await fetch('/api/nodes/stats');
        const statsData = await statsRes.json();
        setStats(statsData);
      } catch (error) {
        console.error('Farm verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFarmData();
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">My Farm</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {stats?.activeNodes} / {stats?.totalNodes} node aktif
          </p>
        </div>
        <Link
          href="/my-farm/add-node"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Yeni Node Ekle</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Node</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalNodes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Render</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalRenders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Uptime</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.averageUptime}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-orange-500">₡</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Kredi</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalCredits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold dark:text-white">{node.name}</h3>
                  <p className={`text-sm ${
                    node.status === 'active' ? 'text-green-500' :
                    node.status === 'idle' ? 'text-blue-500' :
                    node.status === 'maintenance' ? 'text-orange-500' :
                    'text-red-500'
                  }`}>
                    {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {}} 
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  <Link
                    href={`/my-farm/maintenance/${node.id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <WrenchScrewdriverIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sistem</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-medium dark:text-white">{node.specs.cpu}</p>
                      <p className="text-gray-500 dark:text-gray-400">CPU</p>
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{node.specs.ram}</p>
                      <p className="text-gray-500 dark:text-gray-400">RAM</p>
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{node.specs.gpu}</p>
                      <p className="text-gray-500 dark:text-gray-400">GPU</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Performans</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">CPU</span>
                        <span className="font-medium dark:text-white">{node.performance.cpuUsage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full" 
                          style={{ width: `${node.performance.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">RAM</span>
                        <span className="font-medium dark:text-white">{node.performance.ramUsage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${node.performance.ramUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Sıcaklık</span>
                        <span className="font-medium dark:text-white">{node.performance.temperature}°C</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            node.performance.temperature > 80 ? 'bg-red-500' :
                            node.performance.temperature > 60 ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(node.performance.temperature / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {node.currentJob && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mevcut İş</p>
                    <Link 
                      href={`/job/${node.currentJob.id}`}
                      className="block p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <p className="font-medium dark:text-white mb-1">{node.currentJob.name}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${node.currentJob.progress}%` }}
                        />
                      </div>
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Son Görülme</p>
                    <p className="font-medium dark:text-white">{node.lastSeen}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Toplam Render</p>
                    <p className="font-medium dark:text-white">{node.totalRenders}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 