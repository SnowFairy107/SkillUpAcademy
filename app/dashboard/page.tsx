'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/my-courses');
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span>Redirecting to your enrolled courses...</span>
      </div>
    </div>
  );
}
