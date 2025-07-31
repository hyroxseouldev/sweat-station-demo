import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MemberProfile } from '@/components/members/member-profile';
import { MemberMemberships } from '@/components/members/member-memberships';
import { MemberActivity } from '@/components/members/member-activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockApiService } from '@/services/mock-data';

interface Props {
  params: Promise<{ id: string }>;
}

function MemberProfileLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MembershipLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params;
  
  // Check if member exists
  const memberResponse = await mockApiService.getMember(id);
  
  if (!memberResponse.success || !memberResponse.data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Member profile */}
      <Suspense fallback={<MemberProfileLoading />}>
        <MemberProfile memberId={id} />
      </Suspense>

      {/* Member memberships and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<MembershipLoading />}>
          <MemberMemberships memberId={id} />
        </Suspense>
        
        <Suspense fallback={<MembershipLoading />}>
          <MemberActivity memberId={id} />
        </Suspense>
      </div>
    </div>
  );
}