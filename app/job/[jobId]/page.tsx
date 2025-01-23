'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  PlayIcon, 
  PauseIcon, 
  TrashIcon, 
  ArrowPathIcon,
  ChevronDownIcon,
  DocumentIcon,
  PhotoIcon,
  ClockIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface RenderedFrame {
  frame: number;
  renderer: string;
  time: string;
  status: string;
  preview: string;
}

interface Renderer {
  name: string;
  avatar: string;
  status: string;
  completedFrames: number;
  totalRenderTime: string;
}

export default function JobDetail() {
  const params = useParams();
  const jobId = params.jobId;
  const [showFullRenders, setShowFullRenders] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<RenderedFrame | null>(null);

  // Bu kısım normalde API'den gelecek
  const jobDetail = {
    id: jobId,
    name: 'scene_final_v2.blend',
    status: 'Rendering',
    progress: 45,
    timeRemaining: '2h 15m',
    settings: {
      resolution: '1920x1080',
      samples: 128,
      outputFormat: 'PNG',
      device: 'GPU',
      frames: '1-250'
    },
    renderedFrames: Array.from({ length: 141 }, (_, i) => ({
      frame: i + 1,
      renderer: `Node ${Math.floor(Math.random() * 5) + 1}`,
      time: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 60)}s`,
      status: Math.random() > 0.7 ? 'Completed' : Math.random() > 0.5 ? 'Rendering' : 'Pending',
      preview: `/frames/frame_${i + 1}.jpg`
    })),
    renderers: [
      { name: 'Node 1', avatar: '/avatars/node1.jpg', status: 'Active', completedFrames: 45, totalRenderTime: '1h 30m' },
      { name: 'Node 2', avatar: '/avatars/node2.jpg', status: 'Active', completedFrames: 32, totalRenderTime: '1h 15m' },
      { name: 'Node 3', avatar: '/avatars/node3.jpg', status: 'Idle', completedFrames: 28, totalRenderTime: '1h 05m' }
    ]
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Job Details</h1>
        <p className="text-gray-600">Manage and monitor your render job</p>
      </div>

      {/* Job Header */}
      <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 dark:text-white">{jobDetail.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-orange-500 dark:text-orange-400">{jobDetail.status}</span>
              <span className="text-gray-500 dark:text-gray-400">Time Remaining: {jobDetail.timeRemaining}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded-lg">
              <PauseIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded-lg">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-orange-500 dark:bg-orange-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${jobDetail.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Render Settings */}
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Render Settings</h2>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Resolution</p>
              <p className="font-medium dark:text-white">{jobDetail.settings.resolution}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Samples</p>
              <p className="font-medium dark:text-white">{jobDetail.settings.samples}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Output Format</p>
              <p className="font-medium dark:text-white">{jobDetail.settings.outputFormat}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Device</p>
              <p className="font-medium dark:text-white">{jobDetail.settings.device}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Frames</p>
              <p className="font-medium dark:text-white">{jobDetail.settings.frames}</p>
            </div>
          </div>
        </div>

        {/* Rendered Frames */}
        <div className="lg:col-span-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium dark:text-white">Rendered Frames</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-gray-300/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-400/50 dark:hover:bg-gray-600/50">
                Download All
              </button>
              <button 
                onClick={() => setShowFullRenders(!showFullRenders)}
                className="px-3 py-1.5 text-sm bg-gray-300/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-400/50 dark:hover:bg-gray-600/50"
              >
                Show Renders
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2">
            {jobDetail.renderedFrames.map((frame) => (
              <div
                key={frame.frame}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                  frame.status === 'Completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : frame.status === 'Rendering'
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title={`Frame ${frame.frame}\nRenderer: ${frame.renderer}\nTime: ${frame.time}\nStatus: ${frame.status}`}
              >
                {frame.frame}
              </div>
            ))}
          </div>
        </div>

        {/* Renderers */}
        <div className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4 dark:text-white">Renderers</h2>
          <div className="space-y-4">
            {jobDetail.renderers.map((renderer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1 dark:text-white">{renderer.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{renderer.completedFrames} frames</span>
                    <span>•</span>
                    <span>{renderer.totalRenderTime}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  renderer.status === 'Active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {renderer.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Size Renders Modal */}
      {showFullRenders && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Full Size Renders</h3>
              <button 
                onClick={() => setShowFullRenders(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {jobDetail.renderedFrames
                .filter(frame => frame.status === 'Completed')
                .map((frame) => (
                  <div key={frame.frame} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Frame {frame.frame}</h4>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <img 
                      src={frame.preview} 
                      alt={`Frame ${frame.frame}`} 
                      className="w-full rounded-lg"
                    />
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Frame Detail Modal */}
      {selectedFrame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">
                Frame {selectedFrame.frame}
              </h2>
              <button
                onClick={() => setSelectedFrame(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <img
              src={selectedFrame.preview}
              alt={`Frame ${selectedFrame.frame}`}
              className="w-full aspect-video object-cover rounded-lg mb-4"
            />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Renderer</dt>
                <dd className="font-medium dark:text-white">{selectedFrame.renderer}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Render Time</dt>
                <dd className="font-medium dark:text-white">{selectedFrame.time}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="font-medium dark:text-white">{selectedFrame.status}</dd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 