'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign } from 'lucide-react';

// Mock revenue data
const generateRevenueData = (period: string) => {
  const now = new Date();
  const data = [];
  
  if (period === '7days') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 200000) + 50000,
      });
    }
  } else if (period === '30days') {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 150000) + 30000,
      });
    }
  } else { // 12months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      data.push({
        date: date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' }),
        revenue: Math.floor(Math.random() * 3000000) + 1000000,
      });
    }
  }
  
  return data;
};

export function RevenueChart() {
  const [period, setPeriod] = useState('30days');
  const [data, setData] = useState<{ date: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setData(generateRevenueData(period));
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalRevenue = () => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  };

  const getMaxRevenue = () => {
    return Math.max(...data.map(item => item.revenue));
  };

  const getAverageRevenue = () => {
    return data.length > 0 ? getTotalRevenue() / data.length : 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>매출 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>매출 현황</span>
          </CardTitle>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7일</SelectItem>
              <SelectItem value="30days">30일</SelectItem>
              <SelectItem value="12months">12개월</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>총 매출: {formatCurrency(getTotalRevenue())}</span>
          <span>평균: {formatCurrency(getAverageRevenue())}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end space-x-1">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-100 rounded-t relative group">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{
                      height: `${(item.revenue / getMaxRevenue()) * 200}px`,
                      minHeight: '4px',
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                  {item.date}
                </span>
              </div>
            ))}
          </div>

          {/* Legend and Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">매출</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+12.5%</span>
                <span className="text-gray-500">전기 대비</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}