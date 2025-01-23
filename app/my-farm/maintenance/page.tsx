'use client';

import {
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  BoltIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

export default function Maintenance() {
  const nodes = [
    {
      id: 1,
      name: 'Node 1',
      status: 'Maintenance',
      lastCheck: '2024-03-15',
      nextCheck: '2024-04-15',
      uptime: '45d 12h',
      health: 95
    },
    {
      id: 2,
      name: 'Node 2',
      status: 'Active',
      lastCheck: '2024-03-10',
      nextCheck: '2024-04-10',
      uptime: '30d 8h',
      health: 88
    }
  ];

  const maintenanceTasks = [
    {
      id: 1,
      name: 'System Update',
      description: 'Update system packages and drivers',
      status: 'Pending',
      estimatedTime: '30m',
      priority: 'High'
    },
    {
      id: 2,
      name: 'Cache Clear',
      description: 'Clear temporary files and render cache',
      status: 'In Progress',
      estimatedTime: '15m',
      priority: 'Medium'
    },
    {
      id: 3,
      name: 'Health Check',
      description: 'Run diagnostics on CPU, GPU, and memory',
      status: 'Completed',
      estimatedTime: '45m',
      priority: 'High'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Maintenance</h1>
        <p className="text-gray-500 dark:text-gray-400">Node bakımını ve sistem güncellemelerini yönetin</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <button className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors">
          <ArrowPathIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          <span className="font-medium dark:text-white">System Update</span>
        </button>
        <button className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors">
          <BoltIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          <span className="font-medium dark:text-white">Quick Test</span>
        </button>
        <button className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors">
          <ShieldCheckIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          <span className="font-medium dark:text-white">Security Scan</span>
        </button>
        <button className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors">
          <CpuChipIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          <span className="font-medium dark:text-white">Diagnostics</span>
        </button>
      </div>

      {/* Nodes Status */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-medium mb-1 dark:text-white">{node.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  node.status === 'Maintenance'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {node.status}
                </span>
              </div>
              <ServerIcon className="w-6 h-6 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Health Score</span>
                  <span className="text-gray-600 dark:text-gray-300">{node.health}%</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      node.health >= 90
                        ? 'bg-green-500'
                        : node.health >= 70
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${node.health}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Last Check</p>
                  <p className="font-medium dark:text-white">{node.lastCheck}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Next Check</p>
                  <p className="font-medium dark:text-white">{node.nextCheck}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Uptime</p>
                  <p className="font-medium dark:text-white">{node.uptime}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Tasks */}
      <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-medium dark:text-white">Maintenance Tasks</h2>
        </div>
        <div className="divide-y divide-gray-300 dark:divide-gray-700">
          {maintenanceTasks.map((task) => (
            <div key={task.id} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium dark:text-white">{task.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === 'Completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : task.status === 'In Progress'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {task.status}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{task.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Estimated Time: </span>
                  <span className="font-medium dark:text-white">{task.estimatedTime}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Priority: </span>
                  <span className={`font-medium ${
                    task.priority === 'High'
                      ? 'text-red-500 dark:text-red-400'
                      : task.priority === 'Medium'
                      ? 'text-yellow-500 dark:text-yellow-400'
                      : 'text-green-500 dark:text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 