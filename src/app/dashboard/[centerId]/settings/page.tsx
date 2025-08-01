import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GeneralSettings } from '@/components/settings/general-settings';
import { NotificationSettings } from '@/components/settings/notification-settings';
import { PrivacySettings } from '@/components/settings/privacy-settings';
import { IntegrationSettings } from '@/components/settings/integration-settings';

// Loading components
function SettingsLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-2">
          센터 운영에 필요한 다양한 설정을 관리하세요
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="space-y-6">
          <Suspense fallback={<SettingsLoading />}>
            <GeneralSettings />
          </Suspense>

          <Suspense fallback={<SettingsLoading />}>
            <PrivacySettings />
          </Suspense>
        </div>

        {/* Notification & Integration Settings */}
        <div className="space-y-6">
          <Suspense fallback={<SettingsLoading />}>
            <NotificationSettings />
          </Suspense>

          <Suspense fallback={<SettingsLoading />}>
            <IntegrationSettings />
          </Suspense>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">위험 구역</CardTitle>
            <p className="text-sm text-red-600">
              아래 작업들은 되돌릴 수 없습니다. 신중하게 결정하세요.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-medium text-red-700">모든 데이터 삭제</h3>
                <p className="text-sm text-red-600">
                  센터의 모든 회원, 멤버십, 수업 데이터를 영구적으로 삭제합니다.
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                데이터 삭제
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-medium text-red-700">센터 계정 삭제</h3>
                <p className="text-sm text-red-600">
                  센터 계정과 모든 관련 데이터를 영구적으로 삭제합니다.
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                계정 삭제
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}