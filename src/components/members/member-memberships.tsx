import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Pause, 
  Play,
  Plus
} from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  memberId: string;
}

async function MemberMembershipsContent({ memberId }: Props) {
  const membershipsResponse = await mockApiService.getActiveMemberships();
  const memberMemberships = membershipsResponse.data.filter(
    m => m.memberId === memberId
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">멤버십 현황</CardTitle>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            멤버십 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {memberMemberships.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                활성 멤버십이 없습니다
              </h3>
              <p className="text-gray-500 mb-4">
                이 회원의 첫 번째 멤버십을 추가해보세요
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                멤버십 추가
              </Button>
            </div>
          ) : (
            memberMemberships.map((membership) => (
              <div
                key={membership.id}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                {/* Membership header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    {membership.membershipType?.name}
                  </h4>
                  <Badge
                    variant={
                      membership.status === 'active'
                        ? 'default'
                        : membership.status === 'paused'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {membership.status === 'active'
                      ? '활성'
                      : membership.status === 'paused'
                      ? '일시정지'
                      : membership.status === 'expired'
                      ? '만료'
                      : '취소'}
                  </Badge>
                </div>

                {/* Membership details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(membership.startDate), 'yyyy.MM.dd', { locale: ko })}
                        {membership.endDate && 
                          ` - ${format(new Date(membership.endDate), 'yyyy.MM.dd', { locale: ko })}`
                        }
                      </span>
                    </div>
                    {membership.membershipType?.price && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        <span>₩{parseInt(membership.membershipType.price).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {membership.totalPausedDays > 0 && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Pause className="w-4 h-4" />
                        <span>총 {membership.totalPausedDays}일 일시정지</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Session usage for limited session memberships */}
                {membership.membershipType?.type === 'limited_sessions' && 
                 membership.sessionsTotal && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">이용 현황</span>
                      <span className="font-medium">
                        {membership.sessionsUsed} / {membership.sessionsTotal} 회
                      </span>
                    </div>
                    <Progress 
                      value={(membership.sessionsUsed / membership.sessionsTotal) * 100}
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500">
                      잔여 {membership.sessionsTotal - membership.sessionsUsed}회
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                  {membership.status === 'active' && (
                    <Button variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-2" />
                      일시정지
                    </Button>
                  )}
                  {membership.status === 'paused' && (
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      재개
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    상세보기
                  </Button>
                </div>

                {/* Notes */}
                {membership.notes && (
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    <span className="text-gray-500 font-medium">메모: </span>
                    <span className="text-gray-700">{membership.notes}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MemberMemberships({ memberId }: Props) {
  return <MemberMembershipsContent memberId={memberId} />;
}