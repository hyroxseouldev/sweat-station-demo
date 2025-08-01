'use client';

import { useRouter } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { ChevronDown, User, Settings, CreditCard, LogOut, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderDropdownProps {
  centerId?: string;
}

export function HeaderDropdown({ centerId }: HeaderDropdownProps) {
  const router = useRouter();
  const { user } = useUser();

  const handleProfileClick = () => {
    router.push('/dashboard/profile');
  };

  const handleCenterSettings = () => {
    if (centerId) {
      router.push(`/dashboard/${centerId}/settings`);
    } else {
      router.push('/dashboard/settings');
    }
  };

  const handleCenterManagement = () => {
    if (centerId) {
      router.push(`/dashboard/${centerId}/center`);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubscription = () => {
    router.push('/dashboard/subscription');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {user?.firstName && user?.lastName 
            ? `${user.lastName}${user.firstName}` 
            : user?.username || '사용자'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Profile and account settings */}
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          프로필 설정
        </DropdownMenuItem>

        {/* Center management */}
        {centerId && (
          <DropdownMenuItem onClick={handleCenterManagement}>
            <Building2 className="mr-2 h-4 w-4" />
            센터 관리
          </DropdownMenuItem>
        )}

        {/* Center settings */}
        <DropdownMenuItem onClick={handleCenterSettings}>
          <Settings className="mr-2 h-4 w-4" />
          {centerId ? '센터 설정' : '설정'}
        </DropdownMenuItem>

        {/* Subscription management */}
        <DropdownMenuItem onClick={handleSubscription}>
          <CreditCard className="mr-2 h-4 w-4" />
          구독 관리
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <SignOutButton redirectUrl="/">
          <DropdownMenuItem className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}