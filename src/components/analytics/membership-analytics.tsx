'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, TrendingUp, Clock, Hash } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { MembershipType } from '@/types/database';

interface MembershipStats {
  membershipType: MembershipType;
  activeMemberships: number;
  totalRevenue: string;
  averagePrice: number;
  conversionRate: number;
}

export function MembershipAnalytics() {
  const [membershipStats, setMembershipStats] = useState<MembershipStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMembershipAnalytics();
  }, []);

  const loadMembershipAnalytics = async () => {
    try {
      // Get membership types and generate analytics
      const response = await mockApiService.getMembershipTypes();
      
      if (response.success) {
        const stats: MembershipStats[] = response.data.map((type, index) => ({
          membershipType: type,
          activeMemberships: Math.floor(Math.random() * 15) + 5, // Mock data
          totalRevenue: (Math.floor(Math.random() * 2000000) + 500000).toString(),
          averagePrice: parseInt(type.price),
          conversionRate: Math.floor(Math.random() * 40) + 40, // 40-80%
        }));
        
        // Sort by revenue (descending)
        stats.sort((a, b) => parseInt(b.totalRevenue) - parseInt(a.totalRevenue));
        setMembershipStats(stats);
      }
    } catch (error) {
      console.error('Failed to load membership analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseInt(amount) : amount;
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTotalRevenue = () => {
    return membershipStats.reduce((sum, stat) => sum + parseInt(stat.totalRevenue), 0);
  };

  const getTotalActiveMemberships = () => {
    return membershipStats.reduce((sum, stat) => sum + stat.activeMemberships, 0);
  };

  const getRevenuePercentage = (revenue: string) => {
    const total = getTotalRevenue();
    return total > 0 ? (parseInt(revenue) / total) * 100 : 0;
  };

  const getMembershipIcon = (type: string) => {
    switch (type) {
      case 'unlimited_time':
        return <Clock className="h-4 w-4" />;
      case 'limited_sessions':
        return <Hash className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getMembershipTypeName = (type: string) => {
    switch (type) {
      case 'unlimited_time':
        return '기간제';
      case 'limited_sessions':
        return '횟수권';
      case 'day_pass':
        return '일일권';
      default:
        return type;
    }
  };

  const getConversionRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-blue-600';
    if (rate >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>멤버십 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>멤버십 분석</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>총 매출: {formatCurrency(getTotalRevenue())}</span>
          <span>활성 멤버십: {getTotalActiveMemberships()}개</span>
        </div>
      </CardHeader>
      <CardContent>
        {membershipStats.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">멤버십 데이터가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Membership Type Performance */}
            <div className="space-y-4">
              {membershipStats.map((stat, index) => (
                <div key={stat.membershipType.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getMembershipIcon(stat.membershipType.type)}
                        <h3 className="font-medium">{stat.membershipType.name}</h3>
                      </div>
                      <Badge variant="outline">
                        {getMembershipTypeName(stat.membershipType.type)}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {stat.activeMemberships}개 활성
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(stat.totalRevenue)}</p>
                      <p className="text-xs text-gray-500">
                        {getRevenuePercentage(stat.totalRevenue).toFixed(1)}% 기여
                      </p>
                    </div>
                  </div>
                  
                  {/* Revenue Progress Bar */}
                  <div className="space-y-1">
                    <Progress 
                      value={getRevenuePercentage(stat.totalRevenue)} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>평균 가격: {formatCurrency(stat.averagePrice)}</span>
                      <span className={`font-medium ${getConversionRateColor(stat.conversionRate)}`}>
                        전환율: {stat.conversionRate}%
                      </span>
                    </div>
                  </div>
                  
                  {stat.membershipType.description && (
                    <p className="text-xs text-gray-600">{stat.membershipType.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      {formatCurrency(getTotalRevenue() / membershipStats.length)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">평균 멤버십 매출</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      {Math.round(getTotalActiveMemberships() / membershipStats.length)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">평균 활성 멤버십</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📊 인사이트</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {membershipStats.length > 0 && (
                  <>
                    <li>
                      • 가장 인기 있는 멤버십: {membershipStats[0].membershipType.name} 
                      ({membershipStats[0].activeMemberships}개 활성)
                    </li>
                    <li>
                      • 최고 매출 멤버십: {membershipStats[0].membershipType.name} 
                      ({formatCurrency(membershipStats[0].totalRevenue)})
                    </li>
                    <li>
                      • 평균 전환율: {Math.round(membershipStats.reduce((sum, stat) => sum + stat.conversionRate, 0) / membershipStats.length)}%
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}