import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CenterBreadcrumb } from '@/components/dashboard/center-breadcrumb';
import { CenterInfoForm } from '@/components/center/center-info-form';
import { CenterOperatingHours } from '@/components/center/center-operating-hours';
import { CenterImages } from '@/components/center/center-images';
import { CenterSubscription } from '@/components/center/center-subscription';

// Loading components
function CenterInfoLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function OperatingHoursLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface CenterPageProps {
  params: Promise<{
    centerId: string;
  }>;
}

export default async function CenterPage({ params }: CenterPageProps) {
  const { centerId } = await params;
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <CenterBreadcrumb centerId={centerId} currentPage="센터 관리" />

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">센터 관리</h1>
        <p className="text-gray-600 mt-2">
          센터 기본 정보와 운영 설정을 관리하세요
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Center basic info */}
        <div className="space-y-8">
          <Suspense fallback={<CenterInfoLoading />}>
            <CenterInfoForm centerId={centerId} />
          </Suspense>

          <Suspense fallback={<OperatingHoursLoading />}>
            <CenterOperatingHours centerId={centerId} />
          </Suspense>
        </div>

        {/* Images and subscription */}
        <div className="space-y-8">
          <Suspense fallback={<CenterInfoLoading />}>
            <CenterImages centerId={centerId} />
          </Suspense>

          <Suspense fallback={<CenterInfoLoading />}>
            <CenterSubscription centerId={centerId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}