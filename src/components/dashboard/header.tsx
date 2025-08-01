import { currentUser } from '@clerk/nextjs/server';
import { Bell, User, Building2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HeaderDropdown } from './header-dropdown';
import { HeaderNotifications } from './header-notifications';
import { mockApiService } from '@/services/mock-data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Center } from '@/types/database';

interface HeaderProps {
  centerId?: string;
}

// Server component for center data
async function CenterInfo({ centerId }: { centerId?: string }) {
  try {
    let center: Center | null = null;
    
    if (centerId) {
      const response = await mockApiService.getCenter(centerId);
      if (response.success) {
        center = response.data;
      }
    } else {
      // If no centerId, get default center or show general info
      const centersResponse = await mockApiService.getCenters();
      if (centersResponse.success && centersResponse.data.length > 0) {
        center = centersResponse.data[0]; // Use first center as default
      }
    }

    if (!center) {
      return (
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-gray-400" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Sweat Station
            </h1>
            <p className="text-sm text-gray-500">센터 관리 시스템</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          {center.logoUrl ? (
            <img 
              src={center.logoUrl} 
              alt={center.name}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <Building2 className="w-6 h-6 text-blue-600" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {center.name}
          </h1>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                center.status === 'active'
                  ? 'default'
                  : center.status === 'trial'
                  ? 'secondary'
                  : 'destructive'
              }
              className="text-xs"
            >
              {center.status === 'active'
                ? '운영중'
                : center.status === 'trial'
                ? '체험기간'
                : '중단됨'}
            </Badge>
            {center.address && (
              <span className="text-xs text-gray-500 hidden md:block">
                {center.address}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load center info:', error);
    return (
      <div className="flex items-center space-x-3">
        <Building2 className="h-6 w-6 text-gray-400" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Sweat Station
          </h1>
          <p className="text-sm text-gray-500">센터 관리 시스템</p>
        </div>
      </div>
    );
  }
}

// Loading component for center info
function CenterInfoLoading() {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// Server component for user info
async function UserInfo() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900">
              게스트 사용자
            </div>
            <div className="text-xs text-gray-500">
              로그인 필요
            </div>
          </div>
        </div>
      );
    }

    // Get user role from metadata or default to member
    const userRole = user.publicMetadata?.role as string || 'member';
    const displayName = user.firstName && user.lastName 
      ? `${user.lastName}${user.firstName}`
      : user.username || user.emailAddresses[0]?.emailAddress.split('@')[0] || '사용자';

    return (
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {displayName}
          </div>
          <div className="text-xs text-gray-500">
            {userRole === 'center_admin'
              ? '센터 관리자'
              : userRole === 'staff'
              ? '직원'
              : '회원'}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load user info:', error);
    return (
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            사용자
          </div>
          <div className="text-xs text-gray-500">
            로드 중...
          </div>
        </div>
      </div>
    );
  }
}

// Loading component for user info
function UserInfoLoading() {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="hidden md:block space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Main server component header
export async function Header({ centerId }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Center info */}
        <div className="flex items-center min-w-0">
          <Suspense fallback={<CenterInfoLoading />}>
            <CenterInfo centerId={centerId} />
          </Suspense>
        </div>

        {/* Right side - notifications and user menu */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <Suspense fallback={<Button variant="ghost" size="sm"><Bell className="h-5 w-5" /></Button>}>
            <HeaderNotifications />
          </Suspense>

          {/* Quick settings button (mobile) */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <div className="flex items-center">
            <Suspense fallback={<UserInfoLoading />}>
              <UserInfo />
            </Suspense>
            <HeaderDropdown centerId={centerId} />
          </div>
        </div>
      </div>
    </header>
  );
}