'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, MessageSquare, Phone, Calendar } from 'lucide-react';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    // Email Notifications
    emailEnabled: true,
    newMemberNotifications: true,
    paymentNotifications: true,
    classBookingNotifications: true,
    membershipExpiryNotifications: true,
    
    // SMS Notifications
    smsEnabled: false,
    urgentNotifications: true,
    reminderNotifications: false,
    
    // Push Notifications
    pushEnabled: true,
    browserNotifications: true,
    mobileNotifications: true,
    
    // Timing
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    
    // Frequency
    digestFrequency: 'daily',
    reportFrequency: 'weekly',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In real implementation, this would save to API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Notification settings saved:', settings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>알림 설정</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          다양한 알림 방식과 타이밍을 설정합니다
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>이메일 알림</span>
            </h3>
            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={(checked) => handleSettingChange('emailEnabled', checked)}
            />
          </div>
          
          {settings.emailEnabled && (
            <div className="ml-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>신규 회원 가입</Label>
                  <p className="text-sm text-gray-500">새로운 회원이 가입했을 때</p>
                </div>
                <Switch
                  checked={settings.newMemberNotifications}
                  onCheckedChange={(checked) => handleSettingChange('newMemberNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>결제 알림</Label>
                  <p className="text-sm text-gray-500">결제가 완료되거나 실패했을 때</p>
                </div>
                <Switch
                  checked={settings.paymentNotifications}
                  onCheckedChange={(checked) => handleSettingChange('paymentNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>수업 예약</Label>
                  <p className="text-sm text-gray-500">수업 예약이나 취소가 있을 때</p>
                </div>
                <Switch
                  checked={settings.classBookingNotifications}
                  onCheckedChange={(checked) => handleSettingChange('classBookingNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>멤버십 만료</Label>
                  <p className="text-sm text-gray-500">멤버십이 만료되기 전 알림</p>
                </div>
                <Switch
                  checked={settings.membershipExpiryNotifications}
                  onCheckedChange={(checked) => handleSettingChange('membershipExpiryNotifications', checked)}
                />
              </div>
            </div>
          )}
        </div>

        {/* SMS Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>SMS 알림</span>
            </h3>
            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={(checked) => handleSettingChange('smsEnabled', checked)}
            />
          </div>
          
          {settings.smsEnabled && (
            <div className="ml-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>긴급 알림</Label>
                  <p className="text-sm text-gray-500">중요한 시스템 알림</p>
                </div>
                <Switch
                  checked={settings.urgentNotifications}
                  onCheckedChange={(checked) => handleSettingChange('urgentNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>리마인더</Label>
                  <p className="text-sm text-gray-500">수업 및 일정 리마인더</p>
                </div>
                <Switch
                  checked={settings.reminderNotifications}
                  onCheckedChange={(checked) => handleSettingChange('reminderNotifications', checked)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>푸시 알림</span>
            </h3>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => handleSettingChange('pushEnabled', checked)}
            />
          </div>
          
          {settings.pushEnabled && (
            <div className="ml-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>브라우저 알림</Label>
                  <p className="text-sm text-gray-500">웹 브라우저에서 알림 표시</p>
                </div>
                <Switch
                  checked={settings.browserNotifications}
                  onCheckedChange={(checked) => handleSettingChange('browserNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>모바일 알림</Label>
                  <p className="text-sm text-gray-500">모바일 앱에서 알림 표시</p>
                </div>
                <Switch
                  checked={settings.mobileNotifications}
                  onCheckedChange={(checked) => handleSettingChange('mobileNotifications', checked)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Timing Settings */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>알림 시간 설정</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>조용한 시간</Label>
                <p className="text-sm text-gray-500">지정한 시간에는 알림을 받지 않습니다</p>
              </div>
              <Switch
                checked={settings.quietHoursEnabled}
                onCheckedChange={(checked) => handleSettingChange('quietHoursEnabled', checked)}
              />
            </div>
            
            {settings.quietHoursEnabled && (
              <div className="ml-6 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>시작 시간</Label>
                  <Select value={settings.quietHoursStart} onValueChange={(value) => handleSettingChange('quietHoursStart', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>종료 시간</Label>
                  <Select value={settings.quietHoursEnd} onValueChange={(value) => handleSettingChange('quietHoursEnd', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frequency Settings */}
        <div className="space-y-4">
          <h3 className="font-medium">알림 빈도</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>일일 요약</Label>
              <Select value={settings.digestFrequency} onValueChange={(value) => handleSettingChange('digestFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">없음</SelectItem>
                  <SelectItem value="daily">매일</SelectItem>
                  <SelectItem value="weekly">주간</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>분석 리포트</Label>
              <Select value={settings.reportFrequency} onValueChange={(value) => handleSettingChange('reportFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">없음</SelectItem>
                  <SelectItem value="weekly">주간</SelectItem>
                  <SelectItem value="monthly">월간</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '알림 설정 저장'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}