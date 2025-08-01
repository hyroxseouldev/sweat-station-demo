'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Eye, Database, Download, Trash2, AlertTriangle } from 'lucide-react';

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    dataRetentionDays: '365',
    anonymizeData: true,
    shareAnalytics: false,
    allowMemberPhotoUpload: true,
    showMemberDirectory: true,
    enableActivityTracking: true,
    cookieConsent: true,
    dataProcessingConsent: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In real implementation, this would save to API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Privacy settings saved:', settings);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      // In real implementation, this would trigger data export
      console.log(`Exporting data in ${format.toUpperCase()} format`);
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>개인정보 및 보안</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          데이터 보호, 개인정보 처리 방침을 설정합니다
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Retention */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>데이터 보관</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>데이터 보관 기간</Label>
                <p className="text-sm text-gray-500">
                  탈퇴한 회원의 데이터를 보관하는 기간
                </p>
              </div>
              <Select value={settings.dataRetentionDays} onValueChange={(value) => handleSettingChange('dataRetentionDays', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30일</SelectItem>
                  <SelectItem value="90">90일</SelectItem>
                  <SelectItem value="180">180일</SelectItem>
                  <SelectItem value="365">1년</SelectItem>
                  <SelectItem value="1095">3년</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>데이터 익명화</Label>
                <p className="text-sm text-gray-500">
                  분석 목적으로 개인정보를 익명화합니다
                </p>
              </div>
              <Switch
                checked={settings.anonymizeData}
                onCheckedChange={(checked) => handleSettingChange('anonymizeData', checked)}
              />
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>데이터 공유</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>분석 데이터 공유</Label>
                <p className="text-sm text-gray-500">
                  서비스 개선을 위한 익명화된 분석 데이터 공유
                </p>
              </div>
              <Switch
                checked={settings.shareAnalytics}
                onCheckedChange={(checked) => handleSettingChange('shareAnalytics', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>회원 사진 업로드 허용</Label>
                <p className="text-sm text-gray-500">
                  회원이 프로필 사진을 업로드할 수 있도록 허용
                </p>
              </div>
              <Switch
                checked={settings.allowMemberPhotoUpload}
                onCheckedChange={(checked) => handleSettingChange('allowMemberPhotoUpload', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>회원 디렉토리 표시</Label>
                <p className="text-sm text-gray-500">
                  다른 회원들에게 회원 목록을 표시
                </p>
              </div>
              <Switch
                checked={settings.showMemberDirectory}
                onCheckedChange={(checked) => handleSettingChange('showMemberDirectory', checked)}
              />
            </div>
          </div>
        </div>

        {/* Tracking & Analytics */}
        <div className="space-y-4">
          <h3 className="font-medium">추적 및 분석</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>활동 추적</Label>
                <p className="text-sm text-gray-500">
                  서비스 이용 패턴 분석을 위한 활동 추적
                </p>
              </div>
              <Switch
                checked={settings.enableActivityTracking}
                onCheckedChange={(checked) => handleSettingChange('enableActivityTracking', checked)}
              />
            </div>
          </div>
        </div>

        {/* Consent Management */}
        <div className="space-y-4">
          <h3 className="font-medium">동의 관리</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>쿠키 사용 동의</Label>
                <p className="text-sm text-gray-500">
                  서비스 개선을 위한 쿠키 사용
                </p>
              </div>
              <Switch
                checked={settings.cookieConsent}
                onCheckedChange={(checked) => handleSettingChange('cookieConsent', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>데이터 처리 동의</Label>
                <p className="text-sm text-gray-500">
                  서비스 제공을 위한 개인정보 처리
                </p>
              </div>
              <Switch
                checked={settings.dataProcessingConsent}
                onCheckedChange={(checked) => handleSettingChange('dataProcessingConsent', checked)}
              />
            </div>
          </div>
        </div>

        {/* Data Management Actions */}
        <div className="space-y-4">
          <h3 className="font-medium">데이터 관리</h3>
          
          <div className="space-y-3">
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  데이터 내보내기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>데이터 내보내기</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    센터의 모든 데이터를 선택한 형식으로 내보낼 수 있습니다.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={() => handleExportData('json')} className="w-full justify-start">
                      JSON 형식으로 내보내기
                    </Button>
                    <Button onClick={() => handleExportData('csv')} className="w-full justify-start">
                      CSV 형식으로 내보내기
                    </Button>
                    <Button onClick={() => handleExportData('pdf')} className="w-full justify-start">
                      PDF 리포트로 내보내기
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="w-full justify-start text-yellow-600 hover:text-yellow-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              개인정보 처리방침 보기
            </Button>
          </div>
        </div>

        {/* GDPR Compliance Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🔒 개인정보 보호</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 모든 개인정보는 암호화되어 안전하게 저장됩니다</li>
            <li>• 회원은 언제든지 자신의 데이터를 확인하고 수정할 수 있습니다</li>
            <li>• 개인정보 보호법에 따라 투명하게 처리됩니다</li>
            <li>• 동의 철회 시 관련 데이터는 즉시 삭제됩니다</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '개인정보 설정 저장'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}