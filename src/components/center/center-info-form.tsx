'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, Globe, MapPin, CreditCard, FileText } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { Center } from '@/types/database';

interface CenterInfoFormProps {
  centerId: string;
}

export function CenterInfoForm({ centerId }: CenterInfoFormProps) {
  const [center, setCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    websiteUrl: '',
    description: '',
    businessRegistrationNumber: '',
    vatNumber: '',
    bankAccount: '',
  });

  useEffect(() => {
    loadCenterData();
  }, [centerId]);

  const loadCenterData = async () => {
    try {
      const response = await mockApiService.getCenter(centerId);
      if (response.success && response.data) {
        setCenter(response.data);
        setFormData({
          name: response.data.name || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          websiteUrl: response.data.websiteUrl || '',
          description: response.data.description || '',
          businessRegistrationNumber: response.data.businessRegistrationNumber || '',
          vatNumber: response.data.vatNumber || '',
          bankAccount: response.data.bankAccount || '',
        });
      }
    } catch (error) {
      console.error('Failed to load center data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!center) return;

    setIsSaving(true);
    try {
      const response = await mockApiService.updateCenter(formData, centerId);
      if (response.success) {
        setCenter(response.data);
        // Show success message (in real app, use toast)
        console.log('Center updated successfully');
      }
    } catch (error) {
      console.error('Failed to update center:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">체험</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">정지</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>센터 기본 정보</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>센터 기본 정보</span>
          </CardTitle>
          {center && getStatusBadge(center.status)}
        </div>
        <p className="text-sm text-gray-600">
          센터의 기본 정보를 관리합니다
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>센터명 *</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="센터 이름을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>전화번호</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="02-1234-5678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>이메일</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@center.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <span>웹사이트</span>
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                placeholder="https://your-center.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>주소</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="센터 주소를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">센터 소개</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="센터에 대한 소개를 작성하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessRegistrationNumber" className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>사업자 등록번호</span>
              </Label>
              <Input
                id="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                placeholder="123-45-67890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vatNumber">부가세 번호</Label>
              <Input
                id="vatNumber"
                value={formData.vatNumber}
                onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                placeholder="VAT-123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount" className="flex items-center space-x-1">
                <CreditCard className="h-4 w-4" />
                <span>계좌번호</span>
              </Label>
              <Input
                id="bankAccount"
                value={formData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                placeholder="은행 계좌번호"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? '저장 중...' : '변경사항 저장'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}