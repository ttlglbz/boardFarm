'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

interface QueueItem {
  id: string;
  name: string;
  status: 'queued' | 'rendering' | 'paused' | 'completed' | 'failed';
  progress: number;
  frames: {
    total: number;
    completed: number;
    failed: number;
  };
  renderTime: string;
  estimatedTime: string;
  priority: 'low' | 'normal' | 'high';
  nodes: number;
  createdAt: string;
}

interface QueueStats {
  activeJobs: number;
  queuedJobs: number;
  completedJobs: number;
  totalNodes: number;
  averageWaitTime: string;
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQueueData() {
      try {
        // Kuyruk verilerini getir
        const queueRes = await fetch('/api/queue');
        const queueData = await queueRes.json();
        setQueue(queueData);

        // İstatistikleri getir
        const statsRes = await fetch('/api/queue/stats');
        const statsData = await statsRes.json();
        setStats(statsData);
      } catch (error) {
        console.error('Kuyruk verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQueueData();
  }, []);

  const handleAction = async (jobId: string, action: 'pause' | 'resume' | 'stop') => {
    try {
      const res = await fetch(`/api/queue/${jobId}/${action}`, {
        method: 'POST',
      });

      if (res.ok) {
        // Kuyruk verilerini güncelle
        const updatedQueue = queue.map(job => {
          if (job.id === jobId) {
            return {
              ...job,
              status: action === 'pause' ? 'paused' as const :
                      action === 'resume' ? 'rendering' as const :
                      'completed' as const
            };
          }
          return job;
        });
        setQueue(updatedQueue);
      }
    } catch (error) {
      console.error('İşlem yapılırken hata:', error);
      alert('İşlem yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

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
          <h1 className="text-2xl font-bold dark:text-white">Render Kuyruğu</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {stats?.activeJobs} aktif, {stats?.queuedJobs} bekleyen iş
          </p>
        </div>
        <Link
          href="/upload"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Yeni İş</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktif İşler</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.activeJobs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bekleyen İşler</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.queuedJobs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Node</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.totalNodes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ort. Bekleme</p>
              <p className="text-2xl font-bold dark:text-white">{stats?.averageWaitTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {queue.map((job) => (
            <div
              key={job.id}
              className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Link
                    href={`/job/${job.id}`}
                    className="font-medium dark:text-white hover:text-primary dark:hover:text-primary-light"
                  >
                    {job.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      job.status === 'rendering' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      job.status === 'queued' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      job.status === 'paused' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === 'rendering' && (
                    <button
                      onClick={() => handleAction(job.id, 'pause')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                    >
                      <PauseIcon className="w-5 h-5" />
                    </button>
                  )}
                  {job.status === 'paused' && (
                    <button
                      onClick={() => handleAction(job.id, 'resume')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                    >
                      <PlayIcon className="w-5 h-5" />
                    </button>
                  )}
                  {(job.status === 'rendering' || job.status === 'paused') && (
                    <button
                      onClick={() => handleAction(job.id, 'stop')}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                    >
                      <StopIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress */}
              {job.status === 'rendering' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">İlerleme</span>
                    <span className="font-medium dark:text-white">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Frames</p>
                  <p className="font-medium dark:text-white">
                    {job.frames.completed}/{job.frames.total}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Render Süresi</p>
                  <p className="font-medium dark:text-white">{job.renderTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Tahmini Süre</p>
                  <p className="font-medium dark:text-white">{job.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Node Sayısı</p>
                  <p className="font-medium dark:text-white">{job.nodes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 