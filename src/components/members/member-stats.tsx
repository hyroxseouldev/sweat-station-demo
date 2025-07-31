import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';

async function MemberStatsContent() {
  // Get member data
  const membersResponse = await mockApiService.getMembers();
  const membershipsResponse = await mockApiService.getActiveMemberships();
  
  const totalMembers = membersResponse.data.length;
  const activeMembers = membershipsResponse.data.filter(m => m.status === 'active').length;
  const inactiveMembers = totalMembers - activeMembers;
  
  // Calculate growth rate (mock calculation)
  const growthRate = '+12%';

  const stats = [
    {
      title: '총 회원수',
      value: totalMembers.toString(),
      description: '전체 등록 회원',
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: '활성 회원',
      value: activeMembers.toString(),
      description: '현재 이용중인 회원',
      icon: UserCheck,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: '비활성 회원',
      value: inactiveMembers.toString(),
      description: '휴면 또는 만료된 회원',
      icon: UserX,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            {index === 0 && (
              <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">
                  {growthRate}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs 지난달</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MemberStats() {
  return <MemberStatsContent />;
}