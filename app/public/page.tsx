'use client';

import { 
  ComputerDesktopIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PublicRenders() {
  // Örnek projeler
  const projects = [
    { 
      name: 'untitled16',
      owner: 'novas_studio',
      frames: '94 Rendering frames',
      progress: { current: 9512, total: 10800 },
      device: 'GPU',
      memory: '4.8 GB'
    },
    { 
      name: 'render up',
      owner: 'manubaba',
      frames: '2 Rendering frames',
      progress: { current: 290, total: 500 },
      device: 'GPU',
      memory: '3.8 GB'
    },
    { 
      name: '2025-01-18 CaracolHector_14_K2',
      owner: 'serjunco',
      frames: '1 Rendering frames',
      progress: { current: 239, total: 240 },
      device: 'GPU',
      memory: '2.7 GB'
    },
    { 
      name: '3.3 INSTALLATION - Install Run Elements (1000-1149)',
      owner: 'mrtesting94',
      frames: '1 Rendering frames',
      progress: { current: 0, total: 150 },
      device: 'GPU',
      memory: '0 GB',
      status: 'Waiting'
    },
    { 
      name: 'cy 8192 4k 121-300',
      owner: 'xiahuanya',
      frames: '21 Rendering frames',
      progress: { current: 2414, total: 6480 },
      device: 'GPU',
      memory: '14.3 GB'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 dark:text-white">Public Renders</h1>
          <p className="text-gray-500 dark:text-gray-400">Browse all public render projects</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/50"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg">
            <FunnelIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto,auto] gap-4 p-4 border-b border-gray-300 dark:border-gray-700 font-medium text-gray-900 dark:text-white">
          <div>Project</div>
          <div>Owner</div>
          <div>Status</div>
          <div>Progress</div>
          <div>Device</div>
          <div>Memory used</div>
        </div>
        <div className="divide-y divide-gray-300 dark:divide-gray-700">
          {projects.map((project, index) => (
            <div key={index} className="grid grid-cols-[2fr,1fr,1fr,1fr,auto,auto] gap-4 p-4 items-center hover:bg-gray-300/50 dark:hover:bg-gray-700/50">
              <div className="font-medium truncate dark:text-white">{project.name}</div>
              <div className="text-gray-600 dark:text-gray-400">{project.owner}</div>
              <div className="text-orange-500 dark:text-orange-400">{project.frames}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 dark:bg-orange-400 rounded-full"
                    style={{ width: `${(project.progress.current / project.progress.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {project.progress.current} / {project.progress.total}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <CpuChipIcon className="w-4 h-4" />
                <ComputerDesktopIcon className="w-4 h-4" />
              </div>
              <div className="text-gray-600 dark:text-gray-400">{project.memory}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 