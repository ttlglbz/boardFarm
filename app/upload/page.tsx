'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface UploadFile {
  file: File;
  progress: number;
  status: 'waiting' | 'uploading' | 'processing' | 'error' | 'done';
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'waiting' as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-blender': ['.blend'],
    },
    maxSize: 1024 * 1024 * 1000, // 1GB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        if (files[i].status !== 'waiting') continue;

        const formData = new FormData();
        formData.append('file', files[i].file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();

        setFiles(prev => prev.map((file, index) => {
          if (index === i) {
            return {
              ...file,
              status: 'done',
              progress: 100,
            };
          }
          return file;
        }));

        // Yükleme başarılı olduğunda proje sayfasına yönlendir
        router.push(`/projects/${data.projectId}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(file => ({
        ...file,
        status: 'error',
        error: 'Yükleme başarısız oldu. Lütfen tekrar deneyin.',
      })));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">Yeni Proje Yükle</h1>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-lg font-medium dark:text-white mb-2">
            Blender dosyalarını buraya sürükleyin
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            veya dosya seçmek için tıklayın
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Maksimum dosya boyutu: 1GB
          </p>
        </div>

        {/* Dosya Listesi */}
        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold dark:text-white">Yüklenecek Dosyalar</h2>
              <button
                onClick={uploadFiles}
                disabled={isUploading || files.every(f => f.status === 'done')}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    Yüklemeyi Başlat
                  </>
                )}
              </button>
            </div>

            {files.map((file, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium dark:text-white truncate">
                      {file.file.name}
                    </p>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            file.status === 'error' ? 'bg-red-500' : 'bg-primary'
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {file.status === 'waiting' && 'Bekliyor'}
                      {file.status === 'uploading' && `${file.progress}%`}
                      {file.status === 'processing' && 'İşleniyor...'}
                      {file.status === 'error' && 'Hata'}
                      {file.status === 'done' && 'Tamamlandı'}
                    </span>
                  </div>
                  {file.error && (
                    <p className="text-sm text-red-500 mt-1">{file.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 