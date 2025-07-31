import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  memberId: string;
}

async function MemberProfileContent({ memberId }: Props) {
  const memberResponse = await mockApiService.getMember(memberId);
  const member = memberResponse.data;

  if (!member) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-600 mb-4">
            <AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            회원을 찾을 수 없습니다
          </h3>
          <p className="text-gray-500">
            요청하신 회원 정보가 존재하지 않습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/members">
                <ArrowLeft className="w-4 h-4 mr-2" />
                회원 목록으로
              </Link>
            </Button>
          </div>
          <Button asChild>
            <Link href={`/dashboard/members/${member.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              정보 수정
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <Avatar className="h-20 w-20">
            <AvatarImage src={member.profileImageUrl} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
              {member.firstName?.[0]}{member.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          {/* Basic info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {member.firstName} {member.lastName}
              </h1>
              <Badge
                variant={member.isActive ? 'default' : 'secondary'}
              >
                {member.isActive ? '활성' : '비활성'}
              </Badge>
              <Badge variant="outline">
                {member.role === 'member' ? '회원' : 
                 member.role === 'staff' ? '직원' : '관리자'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    가입일: {format(member.joinedAt, 'yyyy년 MM월 dd일', { locale: ko })}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {member.birthDate && (
                  <div>
                    <span className="text-gray-500 text-xs">생년월일</span>
                    <p className="font-medium">
                      {format(new Date(member.birthDate), 'yyyy년 MM월 dd일', { locale: ko })}
                    </p>
                  </div>
                )}
                {member.lastLoginAt && (
                  <div>
                    <span className="text-gray-500 text-xs">마지막 로그인</span>
                    <p className="font-medium">
                      {formatDistanceToNow(member.lastLoginAt, {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency contact */}
        {(member.emergencyContactName || member.emergencyContactPhone) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              비상 연락처
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {member.emergencyContactName && (
                  <div>
                    <span className="text-yellow-800 text-sm font-medium">이름</span>
                    <p className="text-yellow-900">{member.emergencyContactName}</p>
                  </div>
                )}
                {member.emergencyContactPhone && (
                  <div>
                    <span className="text-yellow-800 text-sm font-medium">연락처</span>
                    <p className="text-yellow-900">{member.emergencyContactPhone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medical conditions */}
        {member.medicalConditions && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              건강 상태 / 주의사항
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-900">{member.medicalConditions}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MemberProfile({ memberId }: Props) {
  return <MemberProfileContent memberId={memberId} />;
}