'use client';

import {
  CpuChipIcon,
  ClockIcon,
  ChartBarIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

export default function Performance() {
  const stats = [
    { name: 'CPU Kullanımı', value: '85%', icon: CpuChipIcon },
    { name: 'Uptime', value: '99.9%', icon: ClockIcon },
    { name: 'Başarı Oranı', value: '98%', icon: ChartBarIcon },
    { name: 'Aktif Node', value: '3', icon: ServerIcon },
  ];

  const performanceData = [
    { time: '00:00', cpu: 65, memory: 45, gpu: 78 },
    { time: '04:00', cpu: 75, memory: 55, gpu: 85 },
    { time: '08:00', cpu: 85, memory: 65, gpu: 92 },
    { time: '12:00', cpu: 70, memory: 50, gpu: 80 },
    { time: '16:00', cpu: 90, memory: 70, gpu: 95 },
    { time: '20:00', cpu: 80, memory: 60, gpu: 88 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Performance</h1>
        <p className="text-gray-500 dark:text-gray-400">Node performansını ve kaynak kullanımını izleyin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-semibold dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-6 dark:text-white">Kaynak Kullanımı</h2>
        <div className="h-64">
          <div className="h-full flex items-end gap-4">
            {performanceData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                {/* CPU Bar */}
                <div className="w-full flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500/20 dark:bg-blue-500/10 rounded-t"
                    style={{ height: `${data.cpu}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">CPU</span>
                </div>

                {/* Memory Bar */}
                <div className="w-full flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500/20 dark:bg-green-500/10 rounded-t"
                    style={{ height: `${data.memory}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">RAM</span>
                </div>

                {/* GPU Bar */}
                <div className="w-full flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500/20 dark:bg-purple-500/10 rounded-t"
                    style={{ height: `${data.gpu}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">GPU</span>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Details */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* CPU Details */}
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium dark:text-white">CPU</h3>
            <span className="text-blue-500 dark:text-blue-400">85%</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Kullanım</span>
                <span className="text-gray-600 dark:text-gray-300">85%</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Sıcaklık</span>
                <span className="text-gray-600 dark:text-gray-300">65°C</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Memory Details */}
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium dark:text-white">RAM</h3>
            <span className="text-green-500 dark:text-green-400">65%</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Kullanım</span>
                <span className="text-gray-600 dark:text-gray-300">12.8 GB</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Swap</span>
                <span className="text-gray-600 dark:text-gray-300">2.4 GB</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* GPU Details */}
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium dark:text-white">GPU</h3>
            <span className="text-purple-500 dark:text-purple-400">92%</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Kullanım</span>
                <span className="text-gray-600 dark:text-gray-300">92%</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">VRAM</span>
                <span className="text-gray-600 dark:text-gray-300">7.2 GB</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 