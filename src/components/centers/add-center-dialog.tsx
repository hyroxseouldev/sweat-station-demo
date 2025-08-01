'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import type { Center } from '@/types/database';

interface AddCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCenter: (centerData: Partial<Center>) => Promise<void>;
}

export function AddCenterDialog({ open, onOpenChange, onAddCenter }: AddCenterDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    businessRegistrationNumber: '',
    status: 'trial' as const,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddCenter({
        ...formData,
        clerkOrgId: `org_${Date.now()}`, // Mock org ID
      });
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        businessRegistrationNumber: '',
        status: 'trial',
      });
    } catch (error) {
      console.error('Failed to add center:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>새 센터 추가</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Center Name */}
          <div className="space-y-2">
            <Label htmlFor="name">센터명 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="예: 강남 크로스핏"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="예: 서울시 강남구 테헤란로 123"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="02-1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@center.com"
              />
            </div>
          </div>

          {/* Business Registration Number */}
          <div className="space-y-2">
            <Label htmlFor="businessNumber">사업자등록번호</Label>
            <Input
              id="businessNumber"
              value={formData.businessRegistrationNumber}
              onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
              placeholder="123-45-67890"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>센터 상태</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trial">체험</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="suspended">중단</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">센터 설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="센터에 대한 간단한 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '추가 중...' : '센터 추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}