'use client';

import { Bell, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Header() {
  // In a real app, this would come from auth context/API
  const currentUser = {
    name: '김관리자',
    email: 'admin@gangnamcrossfit.com',
    role: 'center_admin',
    avatar: '',
  };

  const currentCenter = {
    name: '강남 크로스핏',
    status: 'active' as const,
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Center info */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentCenter.name}
            </h1>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  currentCenter.status === 'active'
                    ? 'default'
                    : currentCenter.status === 'trial'
                    ? 'secondary'
                    : 'destructive'
                }
                className="text-xs"
              >
                {currentCenter.status === 'active'
                  ? '운영중'
                  : currentCenter.status === 'trial'
                  ? '체험기간'
                  : '중단됨'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side - notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>
                    {currentUser.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentUser.role === 'center_admin'
                      ? '센터 관리자'
                      : currentUser.role === 'staff'
                      ? '직원'
                      : '회원'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                프로필 설정
              </DropdownMenuItem>
              <DropdownMenuItem>센터 설정</DropdownMenuItem>
              <DropdownMenuItem>구독 관리</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}