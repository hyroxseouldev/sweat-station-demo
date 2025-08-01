'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, CreditCard, Clock, Calendar, Hash } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { MembershipType } from '@/types/database';

export function MembershipTypesList() {
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<MembershipType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'unlimited_time' as 'unlimited_time' | 'limited_sessions' | 'day_pass',
    durationDays: '',
    sessionCount: '',
    price: '',
    description: '',
    termsAndConditions: '',
    allowsPause: false,
    maxPauseDays: '',
    pauseCostPerDay: '',
  });

  useEffect(() => {
    loadMembershipTypes();
  }, []);

  const loadMembershipTypes = async () => {
    try {
      const response = await mockApiService.getMembershipTypes();
      if (response.success) {
        setMembershipTypes(response.data);
      }
    } catch (error) {
      console.error('Failed to load membership types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'unlimited_time',
      durationDays: '',
      sessionCount: '',
      price: '',
      description: '',
      termsAndConditions: '',
      allowsPause: false,
      maxPauseDays: '',
      pauseCostPerDay: '',
    });
    setEditingType(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (membershipType: MembershipType) => {
    setFormData({
      name: membershipType.name,
      type: membershipType.type,
      durationDays: membershipType.durationDays?.toString() || '',
      sessionCount: membershipType.sessionCount?.toString() || '',
      price: membershipType.price,
      description: membershipType.description || '',
      termsAndConditions: membershipType.termsAndConditions || '',
      allowsPause: membershipType.allowsPause,
      maxPauseDays: membershipType.maxPauseDays?.toString() || '',
      pauseCostPerDay: membershipType.pauseCostPerDay || '',
    });
    setEditingType(membershipType);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would call the API
    console.log('Submitting membership type:', formData);
    
    // Mock implementation
    const newType: MembershipType = {
      id: editingType?.id || `type-${Date.now()}`,
      centerId: 'center-1',
      name: formData.name,
      type: formData.type,
      durationDays: formData.durationDays ? parseInt(formData.durationDays) : undefined,
      sessionCount: formData.sessionCount ? parseInt(formData.sessionCount) : undefined,
      price: formData.price,
      currency: 'KRW',
      description: formData.description,
      termsAndConditions: formData.termsAndConditions,
      allowsPause: formData.allowsPause,
      maxPauseDays: formData.maxPauseDays ? parseInt(formData.maxPauseDays) : undefined,
      pauseCostPerDay: formData.pauseCostPerDay,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (editingType) {
      setMembershipTypes(prev => prev.map(type => type.id === editingType.id ? newType : type));
    } else {
      setMembershipTypes(prev => [...prev, newType]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 멤버십 유형을 삭제하시겠습니까?')) {
      setMembershipTypes(prev => prev.filter(type => type.id !== id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unlimited_time':
        return <Clock className="h-4 w-4" />;
      case 'limited_sessions':
        return <Hash className="h-4 w-4" />;
      case 'day_pass':
        return <Calendar className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
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

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(parseInt(price));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>멤버십 유형</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
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
          <CardTitle>멤버십 유형</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                새 유형 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingType ? '멤버십 유형 수정' : '새 멤버십 유형 추가'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">멤버십 이름 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="예: 월 정기권"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">유형 *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unlimited_time">기간제 (무제한)</SelectItem>
                        <SelectItem value="limited_sessions">횟수권</SelectItem>
                        <SelectItem value="day_pass">일일권</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.type === 'unlimited_time' && (
                    <div className="space-y-2">
                      <Label htmlFor="durationDays">이용 기간 (일)</Label>
                      <Input
                        id="durationDays"
                        type="number"
                        value={formData.durationDays}
                        onChange={(e) => handleInputChange('durationDays', e.target.value)}
                        placeholder="30"
                      />
                    </div>
                  )}
                  {formData.type === 'limited_sessions' && (
                    <div className="space-y-2">
                      <Label htmlFor="sessionCount">횟수</Label>
                      <Input
                        id="sessionCount"
                        type="number"
                        value={formData.sessionCount}
                        onChange={(e) => handleInputChange('sessionCount', e.target.value)}
                        placeholder="10"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="price">가격 (원) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="150000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="멤버십에 대한 간단한 설명"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsAndConditions">이용 약관</Label>
                  <Textarea
                    id="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                    placeholder="이용 약관 및 주의사항"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowsPause">일시정지 허용</Label>
                    <Switch
                      id="allowsPause"
                      checked={formData.allowsPause}
                      onCheckedChange={(checked) => handleInputChange('allowsPause', checked)}
                    />
                  </div>

                  {formData.allowsPause && (
                    <div className="grid grid-cols-2 gap-4 ml-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxPauseDays">최대 정지 일수</Label>
                        <Input
                          id="maxPauseDays"
                          type="number"
                          value={formData.maxPauseDays}
                          onChange={(e) => handleInputChange('maxPauseDays', e.target.value)}
                          placeholder="7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pauseCostPerDay">일일 정지 비용 (원)</Label>
                        <Input
                          id="pauseCostPerDay"
                          type="number"
                          value={formData.pauseCostPerDay}
                          onChange={(e) => handleInputChange('pauseCostPerDay', e.target.value)}
                          placeholder="1000"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">
                    {editingType ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-gray-600">
          센터에서 제공하는 멤버십 유형을 관리합니다
        </p>
      </CardHeader>
      <CardContent>
        {membershipTypes.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">아직 등록된 멤버십 유형이 없습니다</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 멤버십 유형 추가
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {membershipTypes.map((membershipType) => (
              <div
                key={membershipType.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(membershipType.type)}
                      <h3 className="font-medium">{membershipType.name}</h3>
                      <Badge variant="outline">{getTypeName(membershipType.type)}</Badge>
                    </div>
                    
                    {membershipType.description && (
                      <p className="text-sm text-gray-600 mb-2">{membershipType.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="font-semibold text-lg text-gray-900">
                        {formatPrice(membershipType.price)}
                      </span>
                      {membershipType.durationDays && (
                        <span>{membershipType.durationDays}일</span>
                      )}
                      {membershipType.sessionCount && (
                        <span>{membershipType.sessionCount}회</span>
                      )}
                      {membershipType.allowsPause && (
                        <Badge variant="secondary" className="text-xs">일시정지 가능</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(membershipType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(membershipType.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}