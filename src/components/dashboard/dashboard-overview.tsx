import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';

async function StatsCards() {
  // In a real app, this would be an API call or server action
  const response = await mockApiService.getDashboardStats();
  const stats = response.data;

  const statCards = [
    {
      title: '총 회원수',
      value: stats.memberCount.toString(),
      description: '활성 회원',
      icon: Users,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: '활성 멤버십',
      value: stats.activeMemberships.toString(),
      description: '현재 이용중',
      icon: CreditCard,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: '월 매출',
      value: `₩${parseInt(stats.monthlyRevenue).toLocaleString()}`,
      description: '이번 달',
      icon: TrendingUp,
      trend: '+15%',
      trendUp: true,
    },
    {
      title: '예정된 수업',
      value: stats.upcomingClasses.length.toString(),
      description: '오늘',
      icon: Calendar,
      trend: '일정대로',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">{stat.description}</p>
              <div
                className={`text-xs font-medium ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardOverview() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      }
    >
      <StatsCards />
    </Suspense>
  );
}