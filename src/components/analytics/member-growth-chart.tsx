'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, UserPlus, UserMinus } from 'lucide-react';

// Mock member growth data
const generateMemberData = (period: string) => {
  const now = new Date();
  const data = [];
  let cumulativeMembers = 45; // Starting with 45 members
  
  if (period === '7days') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const newMembers = Math.floor(Math.random() * 3);
      const lostMembers = Math.floor(Math.random() * 2);
      cumulativeMembers += (newMembers - lostMembers);
      data.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        totalMembers: Math.max(cumulativeMembers, 0),
        newMembers,
        lostMembers,
      });
    }
  } else if (period === '30days') {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const newMembers = Math.floor(Math.random() * 5) + 1;
      const lostMembers = Math.floor(Math.random() * 3);
      cumulativeMembers += (newMembers - lostMembers);
      data.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        totalMembers: Math.max(cumulativeMembers, 0),
        newMembers,
        lostMembers,
      });
    }
  } else { // 12months
    cumulativeMembers = 20; // Start lower for year view
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const newMembers = Math.floor(Math.random() * 15) + 5;
      const lostMembers = Math.floor(Math.random() * 8) + 1;
      cumulativeMembers += (newMembers - lostMembers);
      data.push({
        date: date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' }),
        totalMembers: Math.max(cumulativeMembers, 0),
        newMembers,
        lostMembers,
      });
    }
  }
  
  return data;
};

export function MemberGrowthChart() {
  const [period, setPeriod] = useState('30days');
  const [data, setData] = useState<{ 
    date: string; 
    totalMembers: number; 
    newMembers: number; 
    lostMembers: number; 
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    setData(generateMemberData(period));
    setIsLoading(false);
  };

  const getCurrentMembers = () => {
    return data.length > 0 ? data[data.length - 1].totalMembers : 0;
  };

  const getMaxMembers = () => {
    return Math.max(...data.map(item => item.totalMembers));
  };

  const getTotalNewMembers = () => {
    return data.reduce((sum, item) => sum + item.newMembers, 0);
  };

  const getTotalLostMembers = () => {
    return data.reduce((sum, item) => sum + item.lostMembers, 0);
  };

  const getNetGrowth = () => {
    if (data.length < 2) return 0;
    const firstValue = data[0].totalMembers;
    const lastValue = data[data.length - 1].totalMembers;
    return lastValue - firstValue;
  };

  const getGrowthPercentage = () => {
    if (data.length < 2) return 0;
    const firstValue = data[0].totalMembers;
    const netGrowth = getNetGrowth();
    return firstValue > 0 ? (netGrowth / firstValue) * 100 : 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>회원 증가 현황</CardTitle>
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
            <Users className="h-5 w-5" />
            <span>회원 증가 현황</span>
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
          <span>현재 회원: {getCurrentMembers()}명</span>
          <span className={`flex items-center ${getNetGrowth() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {getNetGrowth() >= 0 ? '+' : ''}{getNetGrowth()}명 
            ({getGrowthPercentage() >= 0 ? '+' : ''}{getGrowthPercentage().toFixed(1)}%)
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Line Chart */}
          <div className="h-64 relative">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((percentage) => (
                <line
                  key={percentage}
                  x1="0"
                  y1={`${percentage}%`}
                  x2="100%"
                  y2={`${percentage}%`}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}
              
              {/* Line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={data
                  .map((item, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = 100 - (item.totalMembers / getMaxMembers()) * 100;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              
              {/* Points */}
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - (item.totalMembers / getMaxMembers()) * 100;
                return (
                  <g key={index}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill="#3b82f6"
                      className="hover:r-6 transition-all cursor-pointer"
                    />
                    {/* Tooltip on hover */}
                    <g className="opacity-0 hover:opacity-100 transition-opacity">
                      <rect
                        x={`${x}%`}
                        y={`${y - 15}%`}
                        width="60"
                        height="20"
                        fill="#1f2937"
                        rx="4"
                        transform="translate(-30, -10)"
                      />
                      <text
                        x={`${x}%`}
                        y={`${y - 5}%`}
                        fill="white"
                        fontSize="12"
                        textAnchor="middle"
                      >
                        {item.totalMembers}명
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2">
              {data.map((item, index) => (
                <span key={index} className="text-xs text-gray-500 transform -rotate-45 origin-left">
                  {item.date}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                <UserPlus className="h-4 w-4" />
                <span className="text-lg font-semibold">{getTotalNewMembers()}</span>
              </div>
              <p className="text-xs text-gray-500">신규 가입</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
                <UserMinus className="h-4 w-4" />
                <span className="text-lg font-semibold">{getTotalLostMembers()}</span>
              </div>
              <p className="text-xs text-gray-500">탈퇴</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-lg font-semibold">{getNetGrowth()}</span>
              </div>
              <p className="text-xs text-gray-500">순 증가</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}