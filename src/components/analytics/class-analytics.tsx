'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Clock, TrendingUp, Star } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { Class } from '@/types/database';

interface ClassStats {
  class: Class;
  totalSessions: number;
  totalBookings: number;
  averageAttendance: number;
  attendanceRate: number;
  revenue: number;
  popularityScore: number;
}

export function ClassAnalytics() {
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClassAnalytics();
  }, []);

  const loadClassAnalytics = async () => {
    try {
      // Get classes and generate analytics
      const response = await mockApiService.getClasses();
      
      if (response.success) {
        const stats: ClassStats[] = response.data.map((classItem, index) => {
          const totalSessions = Math.floor(Math.random() * 30) + 10; // 10-40 sessions
          const totalBookings = Math.floor(Math.random() * 200) + 50; // 50-250 bookings
          const averageAttendance = Math.floor(Math.random() * 8) + 4; // 4-12 people
          const attendanceRate = Math.floor(Math.random() * 30) + 70; // 70-100%
          const revenue = parseInt(classItem.pricePerSession || '0') * totalBookings;
          const popularityScore = Math.floor(Math.random() * 50) + 50; // 50-100 score
          
          return {
            class: classItem,
            totalSessions,
            totalBookings,
            averageAttendance,
            attendanceRate,
            revenue,
            popularityScore,
          };
        });
        
        // Sort by popularity score (descending)
        stats.sort((a, b) => b.popularityScore - a.popularityScore);
        setClassStats(stats);
      }
    } catch (error) {
      console.error('Failed to load class analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalRevenue = () => {
    return classStats.reduce((sum, stat) => sum + stat.revenue, 0);
  };

  const getTotalSessions = () => {
    return classStats.reduce((sum, stat) => sum + stat.totalSessions, 0);
  };

  const getTotalBookings = () => {
    return classStats.reduce((sum, stat) => sum + stat.totalBookings, 0);
  };

  const getAverageAttendanceRate = () => {
    if (classStats.length === 0) return 0;
    return classStats.reduce((sum, stat) => sum + stat.attendanceRate, 0) / classStats.length;
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-blue-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPopularityBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-gold-100 text-gold-800">🔥 인기</Badge>;
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">✨ 추천</Badge>;
    if (score >= 70) return <Badge className="bg-blue-100 text-blue-800">👍 양호</Badge>;
    return <Badge variant="outline">📈 성장중</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>수업 분석</CardTitle>
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
          <Calendar className="h-5 w-5" />
          <span>수업 분석</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>총 세션: {getTotalSessions()}회</span>
          <span>총 예약: {getTotalBookings()}건</span>
          <span className={getAttendanceRateColor(getAverageAttendanceRate())}>
            평균 출석률: {getAverageAttendanceRate().toFixed(1)}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {classStats.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">수업 데이터가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Class Performance */}
            <div className="space-y-4">
              {classStats.map((stat, index) => (
                <div key={stat.class.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{stat.class.name}</h3>
                        {stat.class.classType && (
                          <Badge variant="outline">{stat.class.classType}</Badge>
                        )}
                        {getPopularityBadge(stat.popularityScore)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(stat.revenue)}</p>
                      <p className="text-xs text-gray-500">매출</p>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-blue-600">
                        <Calendar className="h-3 w-3" />
                        <span className="font-semibold">{stat.totalSessions}</span>
                      </div>
                      <p className="text-xs text-gray-500">세션</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-purple-600">
                        <Users className="h-3 w-3" />
                        <span className="font-semibold">{stat.totalBookings}</span>
                      </div>
                      <p className="text-xs text-gray-500">예약</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-green-600">
                        <Users className="h-3 w-3" />
                        <span className="font-semibold">{stat.averageAttendance}</span>
                      </div>
                      <p className="text-xs text-gray-500">평균 참석</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`flex items-center justify-center space-x-1 ${getAttendanceRateColor(stat.attendanceRate)}`}>
                        <TrendingUp className="h-3 w-3" />
                        <span className="font-semibold">{stat.attendanceRate}%</span>
                      </div>
                      <p className="text-xs text-gray-500">출석률</p>
                    </div>
                  </div>
                  
                  {/* Attendance Rate Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">출석률</span>
                      <span className={getAttendanceRateColor(stat.attendanceRate)}>
                        {stat.attendanceRate}%
                      </span>
                    </div>
                    <Progress value={stat.attendanceRate} className="h-2" />
                  </div>
                  
                  {/* Class Description */}
                  {stat.class.description && (
                    <p className="text-xs text-gray-600">{stat.class.description}</p>
                  )}
                  
                  {/* Class Details */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {stat.class.durationMinutes}분
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      최대 {stat.class.maxCapacity}명
                    </span>
                    {stat.class.pricePerSession && (
                      <span>회당 {formatCurrency(parseInt(stat.class.pricePerSession))}</span>
                    )}
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      인기도 {stat.popularityScore}점
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      {formatCurrency(getTotalRevenue())}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">총 수업 매출</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      {Math.round(getTotalSessions() / classStats.length)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">평균 세션 수</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      {getAverageAttendanceRate().toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">평균 출석률</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">📊 수업 인사이트</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                {classStats.length > 0 && (
                  <>
                    <li>
                      • 최고 인기 수업: {classStats[0].class.name} 
                      (인기도 {classStats[0].popularityScore}점)
                    </li>
                    <li>
                      • 최고 출석률: {classStats.reduce((max, stat) => 
                        stat.attendanceRate > max.attendanceRate ? stat : max
                      ).class.name} ({classStats.reduce((max, stat) => 
                        stat.attendanceRate > max.attendanceRate ? stat : max
                      ).attendanceRate}%)
                    </li>
                    <li>
                      • 평균 수업당 매출: {formatCurrency(getTotalRevenue() / classStats.length)}
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