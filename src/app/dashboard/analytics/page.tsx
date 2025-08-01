import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RevenueChart } from '@/components/analytics/revenue-chart';
import { MembershipAnalytics } from '@/components/analytics/membership-analytics';
import { ClassAnalytics } from '@/components/analytics/class-analytics';
import { MemberGrowthChart } from '@/components/analytics/member-growth-chart';

// Loading components
function AnalyticsLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">분석</h1>
        <p className="text-gray-600 mt-2">
          센터의 매출, 회원, 수업 현황을 분석하고 인사이트를 확인하세요
        </p>
      </div>

      {/* Key Metrics */}
      <Suspense fallback={<StatsLoading />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">이번 달 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩2,670,000</div>
              <p className="text-xs text-green-600">+12.5% 전월 대비</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">활성 회원</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-blue-600">+0 신규 가입</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">이번 주 수업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-purple-600">평균 출석률 85%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">멤버십 전환율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-orange-600">+5% 전월 대비</p>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Suspense fallback={<AnalyticsLoading />}>
          <RevenueChart />
        </Suspense>

        {/* Member Growth Chart */}
        <Suspense fallback={<AnalyticsLoading />}>
          <MemberGrowthChart />
        </Suspense>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Membership Analytics */}
        <Suspense fallback={<AnalyticsLoading />}>
          <MembershipAnalytics />
        </Suspense>

        {/* Class Analytics */}
        <Suspense fallback={<AnalyticsLoading />}>
          <ClassAnalytics />
        </Suspense>
      </div>
    </div>
  );
}