'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { Subscription, DashboardStats } from '@/types/database';

export function CenterSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      // In real implementation, this would come from subscription API
      const dashboardResponse = await mockApiService.getDashboardStats();
      
      if (dashboardResponse.success) {
        setStats(dashboardResponse.data);
        
        // Mock subscription data based on member count
        const memberCount = dashboardResponse.data.memberCount;
        const mockSubscription: Subscription = {
          id: 'sub-1',
          centerId: 'center-1',
          planType: memberCount > 50 ? 'premium' : 'free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          memberCount,
          amount: memberCount > 50 ? '29900' : '0',
          currency: 'KRW',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setSubscription(mockSubscription);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">체험</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800">연체</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">취소</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'free':
        return <Badge variant="outline">무료 플랜</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">프리미엄</Badge>;
      default:
        return <Badge variant="secondary">{planType}</Badge>;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(parseInt(amount));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getMemberLimitProgress = (memberCount: number) => {
    const freeLimit = 50;
    if (memberCount <= freeLimit) {
      return (memberCount / freeLimit) * 100;
    }
    return 100;
  };

  const getDaysUntilRenewal = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>구독 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>구독 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">구독 정보를 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const daysUntilRenewal = getDaysUntilRenewal(subscription.currentPeriodEnd);
  const memberLimitProgress = getMemberLimitProgress(subscription.memberCount);
  const isApproachingLimit = subscription.memberCount >= 45 && subscription.planType === 'free';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>구독 정보</span>
          </CardTitle>
          <div className="flex space-x-2">
            {getPlanBadge(subscription.planType)}
            {getStatusBadge(subscription.status)}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          현재 구독 플랜과 사용 현황을 확인하세요
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">월 요금</p>
            <p className="text-2xl font-bold">
              {subscription.planType === 'free' ? '무료' : formatCurrency(subscription.amount || '0')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">다음 결제일</p>
            <p className="text-sm text-gray-900">{formatDate(subscription.currentPeriodEnd)}</p>
            <p className="text-xs text-gray-500">{daysUntilRenewal}일 남음</p>
          </div>
        </div>

        {/* Member Count Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              회원 수
            </p>
            <p className="text-sm font-medium">
              {subscription.memberCount} / {subscription.planType === 'free' ? '50명' : '무제한'}
            </p>
          </div>
          
          {subscription.planType === 'free' && (
            <>
              <Progress value={memberLimitProgress} className="h-2" />
              {isApproachingLimit && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    회원 수가 무료 플랜 한도에 근접했습니다. 프리미엄 플랜 업그레이드를 고려해보세요.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              이번 달 매출
            </p>
            <p className="text-lg font-semibold">{formatCurrency(stats.monthlyRevenue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              활성 멤버십
            </p>
            <p className="text-lg font-semibold">{stats.activeMemberships}개</p>
          </div>
        </div>

        {/* Plan Actions */}
        <div className="flex space-x-2 pt-4">
          {subscription.planType === 'free' ? (
            <Button className="flex-1">
              프리미엄으로 업그레이드
            </Button>
          ) : (
            <Button variant="outline" className="flex-1">
              플랜 관리
            </Button>
          )}
          <Button variant="outline">
            결제 내역
          </Button>
        </div>

        {/* Plan Comparison */}
        {subscription.planType === 'free' && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <h4 className="font-medium">프리미엄 플랜 혜택</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 무제한 회원 등록</li>
              <li>• 고급 분석 리포트</li>
              <li>• 우선 고객 지원</li>
              <li>• 추가 기능 이용</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              월 29,900원 (회원 50명 초과 시)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}