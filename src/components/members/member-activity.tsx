import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CreditCard, 
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  memberId: string;
}

async function MemberActivityContent({ memberId }: Props) {
  // Get payment history for this member
  const paymentsResponse = await mockApiService.getPaymentHistory();
  const memberPayments = paymentsResponse.data.filter(
    p => p.memberId === memberId
  ).slice(0, 10); // Show last 10 activities

  // Mock class bookings - in real app this would be a separate API call
  const mockBookings = [
    {
      id: 'booking-1',
      className: 'CrossFit WOD',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'attended' as const,
      instructor: '박트레이너',
    },
    {
      id: 'booking-2',
      className: 'HIIT Training',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: 'no_show' as const,
      instructor: '박트레이너',
    },
    {
      id: 'booking-3',
      className: 'CrossFit WOD',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: 'cancelled' as const,
      instructor: '박트레이너',
    },
  ];

  // Combine and sort activities
  const activities = [
    ...memberPayments.map(payment => ({
      id: payment.id,
      type: 'payment' as const,
      title: payment.description || '멤버십 결제',
      amount: payment.amount,
      date: payment.paymentDate,
      status: payment.status,
    })),
    ...mockBookings.map(booking => ({
      id: booking.id,
      type: 'booking' as const,
      title: booking.className,
      instructor: booking.instructor,
      date: booking.date,
      status: booking.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getActivityIcon = (activity: typeof activities[0]) => {
    if (activity.type === 'payment') {
      return <CreditCard className="w-4 h-4" />;
    } else {
      switch (activity.status) {
        case 'attended':
          return <CheckCircle className="w-4 h-4 text-green-600" />;
        case 'no_show':
          return <XCircle className="w-4 h-4 text-red-600" />;
        case 'cancelled':
          return <XCircle className="w-4 h-4 text-gray-600" />;
        default:
          return <Calendar className="w-4 h-4" />;
      }
    }
  };

  const getActivityBadge = (activity: typeof activities[0]) => {
    if (activity.type === 'payment') {
      return (
        <Badge 
          variant={activity.status === 'completed' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {activity.status === 'completed' ? '결제완료' : 
           activity.status === 'pending' ? '결제대기' : 
           activity.status === 'failed' ? '결제실패' : '환불'}
        </Badge>
      );
    } else {
      return (
        <Badge 
          variant={
            activity.status === 'attended' ? 'default' : 
            activity.status === 'no_show' ? 'destructive' : 'secondary'
          }
          className="text-xs"
        >
          {activity.status === 'attended' ? '참석' : 
           activity.status === 'no_show' ? '불참' : 
           activity.status === 'cancelled' ? '취소' : '예약'}
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>최근 활동</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                활동 내역이 없습니다
              </h3>
              <p className="text-gray-500">
                아직 수업 참석이나 결제 내역이 없습니다
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    {getActivityBadge(activity)}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(activity.date, {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                    
                    {activity.type === 'payment' && activity.amount && (
                      <span className="text-sm font-medium text-gray-900">
                        ₩{parseInt(activity.amount).toLocaleString()}
                      </span>
                    )}
                    
                    {activity.type === 'booking' && activity.instructor && (
                      <span className="text-xs text-gray-500">
                        강사: {activity.instructor}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              모든 활동 보기
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MemberActivity({ memberId }: Props) {
  return <MemberActivityContent memberId={memberId} />;
}