'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  DocumentIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface Project {
  _id: string;
  name: string;
  status: string;
  progress: number;
  uploadDate: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`/api/projects?page=${currentPage}`);
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setProjects(data.projects);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Proje listesi yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email) {
      loadProjects();
    }
  }, [currentPage, session]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold dark:text-white">Projelerim</h1>
          <Link
            href="/upload"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Yeni Proje
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <DocumentIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold dark:text-white mb-2">Henüz Projeniz Yok</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Render etmek istediğiniz Blender dosyalarını yükleyerek başlayın.
            </p>
            <Link
              href="/upload"
              className="text-primary dark:text-primary-dark hover:underline"
            >
              İlk projenizi yükleyin
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project._id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">{project.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === 'rendering' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                      project.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                      project.status === 'failed' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {project.status === 'rendering' ? 'Render Ediliyor' :
                       project.status === 'completed' ? 'Tamamlandı' :
                       project.status === 'failed' ? 'Başarısız' :
                       project.status === 'uploaded' ? 'Yüklendi' :
                       'Sırada'}
                    </span>
                  </div>

                  {project.status === 'rendering' && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        %{project.progress}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Yükleme Tarihi: {new Date(project.uploadDate).toLocaleString('tr-TR')}
                  </div>
                </div>
              </Link>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 