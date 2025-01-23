import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ProjectClient = dynamic(() => import('./ProjectClient'), {
  loading: () => (
    <div className="flex-1 p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  ),
});

interface PageParams {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: PageParams) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  return (
    <Suspense fallback={
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    }>
      <ProjectClient id={id} />
    </Suspense>
  );
} 