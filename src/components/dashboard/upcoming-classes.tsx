import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, User } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';

async function UpcomingClassesContent() {
  const response = await mockApiService.getUpcomingClassSessions();
  const upcomingClasses = response.data;

  return (
    <div className="space-y-4">
      {upcomingClasses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          예정된 수업이 없습니다
        </div>
      ) : (
        upcomingClasses.map((session) => (
          <div
            key={session.id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {session.class?.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {session.class?.description}
                </p>
                
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>
                      {session.currentBookings}/{session.maxCapacity}
                    </span>
                  </div>
                  
                  {session.instructor && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>
                        {session.instructor.firstName} {session.instructor.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <Badge
                  variant={
                    session.status === 'scheduled'
                      ? 'default'
                      : session.status === 'in_progress'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {session.status === 'scheduled'
                    ? '예정'
                    : session.status === 'in_progress'
                    ? '진행중'
                    : session.status === 'completed'
                    ? '완료'
                    : '취소'}
                </Badge>
                
                <Badge
                  variant={
                    session.currentBookings >= session.maxCapacity
                      ? 'destructive'
                      : session.currentBookings > session.maxCapacity * 0.8
                      ? 'secondary'
                      : 'outline'
                  }
                  className="text-xs"
                >
                  {session.currentBookings >= session.maxCapacity
                    ? '만석'
                    : session.currentBookings > session.maxCapacity * 0.8
                    ? '거의 찬 상태'
                    : '여유있음'}
                </Badge>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

interface UpcomingClassesProps {
  centerId?: string;
}

export function UpcomingClasses({ centerId }: UpcomingClassesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">오늘의 수업</CardTitle>
      </CardHeader>
      <CardContent>
        <UpcomingClassesContent />
      </CardContent>
    </Card>
  );
}