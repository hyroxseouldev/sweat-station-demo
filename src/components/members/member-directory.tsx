import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockApiService } from '@/services/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

async function MemberDirectoryContent() {
  const membersResponse = await mockApiService.getMembers();
  const membershipsResponse = await mockApiService.getActiveMemberships();
  const members = membersResponse.data;

  // Combine member data with membership info
  const membersWithMemberships = members.map(member => {
    const membership = membershipsResponse.data.find(m => m.memberId === member.id);
    return {
      ...member,
      membership,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">회원 목록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {membersWithMemberships.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                등록된 회원이 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                첫 번째 회원을 추가해보세요
              </p>
              <Button>
                <User className="w-4 h-4 mr-2" />
                회원 추가
              </Button>
            </div>
          ) : (
            membersWithMemberships.map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.profileImageUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {member.firstName?.[0]}{member.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Member info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <Link
                      href={`/dashboard/members/${member.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {member.firstName} {member.lastName}
                    </Link>
                    <Badge
                      variant={member.isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {member.isActive ? '활성' : '비활성'}
                    </Badge>
                    {member.membership && (
                      <Badge
                        variant={
                          member.membership.status === 'active'
                            ? 'default'
                            : member.membership.status === 'paused'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {member.membership.status === 'active'
                          ? '멤버십 활성'
                          : member.membership.status === 'paused'
                          ? '일시정지'
                          : member.membership.status === 'expired'
                          ? '만료'
                          : '취소'}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        가입일: {formatDistanceToNow(member.joinedAt, {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Membership info */}
                  {member.membership && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-900">
                          {member.membership.membershipType?.name}
                        </span>
                        <span className="text-blue-700">
                          {member.membership.membershipType?.type === 'limited_sessions' 
                            ? `${member.membership.sessionsUsed}/${member.membership.sessionsTotal} 회 사용`
                            : `${member.membership.endDate}까지`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/members/${member.id}`}>
                      상세보기
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/members/${member.id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination would go here in a real app */}
        {membersWithMemberships.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="text-sm text-gray-500">
              총 {membersWithMemberships.length}명의 회원
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                이전
              </Button>
              <Button variant="outline" size="sm" disabled>
                다음
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MemberDirectory() {
  return <MemberDirectoryContent />;
}