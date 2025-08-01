import { Suspense } from 'react';
import { MemberDirectory } from '@/components/members/member-directory';
import { MemberStats } from '@/components/members/member-stats';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function MemberStatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MemberDirectoryLoading() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MembersPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">회원 관리</h1>
          <p className="text-gray-600 mt-2">
            센터 회원들을 관리하고 현황을 확인하세요
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          회원 추가
        </Button>
      </div>

      {/* Member stats */}
      <Suspense fallback={<MemberStatsLoading />}>
        <MemberStats />
      </Suspense>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="회원 이름, 이메일로 검색..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">필터</Button>
      </div>

      {/* Member directory */}
      <Suspense fallback={<MemberDirectoryLoading />}>
        <MemberDirectory />
      </Suspense>
    </div>
  );
}