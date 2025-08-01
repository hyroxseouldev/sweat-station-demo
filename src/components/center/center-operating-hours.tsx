'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { Center } from '@/types/database';

interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

interface OperatingHours {
  [key: string]: DayHours;
}

const DAYS = [
  { key: 'monday', label: '월요일' },
  { key: 'tuesday', label: '화요일' },
  { key: 'wednesday', label: '수요일' },
  { key: 'thursday', label: '목요일' },
  { key: 'friday', label: '금요일' },
  { key: 'saturday', label: '토요일' },
  { key: 'sunday', label: '일요일' },
];

export function CenterOperatingHours() {
  const [center, setCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [operatingHours, setOperatingHours] = useState<OperatingHours>({});

  useEffect(() => {
    loadCenterData();
  }, []);

  const loadCenterData = async () => {
    try {
      const response = await mockApiService.getCenter();
      if (response.success && response.data) {
        setCenter(response.data);
        
        // Convert existing operating hours or set defaults
        const hours: OperatingHours = {};
        DAYS.forEach(({ key }) => {
          const existingHours = response.data.operatingHours?.[key];
          hours[key] = {
            open: existingHours?.open || '09:00',
            close: existingHours?.close || '18:00',
            isClosed: !existingHours,
          };
        });
        setOperatingHours(hours);
      }
    } catch (error) {
      console.error('Failed to load center data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = (day: string, field: 'open' | 'close', value: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleClosedToggle = (day: string, isClosed: boolean) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isClosed,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!center) return;

    setIsSaving(true);
    try {
      // Convert to the format expected by the API
      const formattedHours: Record<string, { open: string; close: string } | null> = {};
      Object.entries(operatingHours).forEach(([day, hours]) => {
        formattedHours[day] = hours.isClosed 
          ? null 
          : { open: hours.open, close: hours.close };
      });

      const response = await mockApiService.updateCenter({
        operatingHours: formattedHours,
      });
      
      if (response.success) {
        setCenter(response.data);
        console.log('Operating hours updated successfully');
      }
    } catch (error) {
      console.error('Failed to update operating hours:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToAll = (sourceDay: string) => {
    const sourceHours = operatingHours[sourceDay];
    if (!sourceHours) return;

    const newHours = { ...operatingHours };
    DAYS.forEach(({ key }) => {
      if (key !== sourceDay) {
        newHours[key] = { ...sourceHours };
      }
    });
    setOperatingHours(newHours);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>운영 시간</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="flex space-x-2">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
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
          <Clock className="h-5 w-5" />
          <span>운영 시간</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          센터의 요일별 운영 시간을 설정합니다
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium">{label}</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">휴무</span>
                  <Switch
                    checked={operatingHours[key]?.isClosed || false}
                    onCheckedChange={(checked) => handleClosedToggle(key, checked)}
                  />
                </div>
              </div>
              
              {!operatingHours[key]?.isClosed && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">시작</Label>
                    <Input
                      type="time"
                      value={operatingHours[key]?.open || '09:00'}
                      onChange={(e) => handleTimeChange(key, 'open', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <span className="text-gray-400">~</span>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">종료</Label>
                    <Input
                      type="time"
                      value={operatingHours[key]?.close || '18:00'}
                      onChange={(e) => handleTimeChange(key, 'close', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToAll(key)}
                    className="text-xs"
                  >
                    전체 적용
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? '저장 중...' : '운영시간 저장'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}