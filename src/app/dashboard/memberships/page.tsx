import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MembershipTypesList } from '@/components/memberships/membership-types-list';
import { ActiveMembershipsList } from '@/components/memberships/active-memberships-list';

// Loading components
function MembershipTypesLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActiveMembershipsLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MembershipsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">멤버십 관리</h1>
        <p className="text-gray-600 mt-2">
          멤버십 유형을 생성하고 관리하며, 활성 멤버십을 확인하세요
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Membership Types */}
        <div className="space-y-6">
          <Suspense fallback={<MembershipTypesLoading />}>
            <MembershipTypesList />
          </Suspense>
        </div>

        {/* Active Memberships */}
        <div className="space-y-6">
          <Suspense fallback={<ActiveMembershipsLoading />}>
            <ActiveMembershipsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}