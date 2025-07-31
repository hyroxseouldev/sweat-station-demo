import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockApiService } from '@/services/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

async function RecentActivityContent() {
  const response = await mockApiService.getDashboardStats();
  const { recentPayments } = response.data;

  return (
    <div className="space-y-4">
      {recentPayments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          최근 활동이 없습니다
        </div>
      ) : (
        recentPayments.map((payment) => (
          <div key={payment.id} className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={payment.member?.profileImageUrl} />
              <AvatarFallback>
                {payment.member?.firstName?.[0]}{payment.member?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {payment.member?.firstName} {payment.member?.lastName}
                </p>
                <Badge variant="outline" className="text-xs">
                  ₩{parseInt(payment.amount).toLocaleString()}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500 truncate">
                  {payment.description}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(payment.paymentDate, {
                    addSuffix: true,
                    locale: ko,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">최근 결제</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentActivityContent />
      </CardContent>
    </Card>
  );
}