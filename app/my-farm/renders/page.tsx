'use client';

import { useState } from 'react';
import {
  Squares2X2Icon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Renders() {
  const [viewMode, setViewMode] = useState('grid');

  const renders = [
    {
      id: 1,
      name: 'scene_final_v2.blend',
      preview: '/render1.jpg',
      frames: '1-240',
      date: '2024-03-15',
      status: 'Completed',
      size: '2.4 GB'
    },
    {
      id: 2,
      name: 'character_animation.blend',
      preview: '/render2.jpg',
      frames: '1-180',
      date: '2024-03-14',
      status: 'Completed',
      size: '1.8 GB'
    },
    // ... diğer renderlar
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Renders</h1>
        <p className="text-gray-500 dark:text-gray-400">Tamamlanan render projelerinizi görüntüleyin ve yönetin</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Render ara..."
              className="pl-10 pr-4 py-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg border-0 focus:ring-2 focus:ring-primary dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50">
            <FunnelIcon className="w-5 h-5" />
            <span>Filtrele</span>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ListBulletIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {renders.map((render) => (
            <div key={render.id} className="group bg-gray-200/50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-300 dark:bg-gray-700 relative">
                <img
                  src={render.preview}
                  alt={render.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-2 bg-white/10 rounded-lg backdrop-blur-sm text-white hover:bg-white/20">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-lg backdrop-blur-sm text-white hover:bg-white/20">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-lg backdrop-blur-sm text-white hover:bg-white/20">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1 truncate dark:text-white">{render.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Frames: {render.frames}</span>
                  <span className="text-gray-500 dark:text-gray-400">{render.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Frames</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Size</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {renders.map((render) => (
                <tr key={render.id} className="border-b border-gray-300 dark:border-gray-700 last:border-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gray-300 dark:bg-gray-700 rounded overflow-hidden">
                        <img
                          src={render.preview}
                          alt={render.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium dark:text-white">{render.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{render.frames}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{render.date}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{render.size}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm">
                      {render.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 