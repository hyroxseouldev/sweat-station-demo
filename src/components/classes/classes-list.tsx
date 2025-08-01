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
import { Plus, Edit, Trash2, Calendar, Users, Clock } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { Class, User } from '@/types/database';

export function ClassesList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    classType: '',
    instructorId: '',
    maxCapacity: '',
    durationMinutes: '',
    pricePerSession: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [classesResponse, membersResponse] = await Promise.all([
        mockApiService.getClasses(),
        mockApiService.getMembers()
      ]);

      if (classesResponse.success) {
        setClasses(classesResponse.data);
      }

      if (membersResponse.success) {
        // Filter for staff members who can be instructors
        const staffMembers = membersResponse.data.filter(user => 
          user.role === 'staff' || user.role === 'center_admin'
        );
        setInstructors(staffMembers);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      classType: '',
      instructorId: '',
      maxCapacity: '',
      durationMinutes: '',
      pricePerSession: '',
    });
    setEditingClass(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setFormData({
      name: classItem.name,
      description: classItem.description || '',
      classType: classItem.classType || '',
      instructorId: classItem.instructorId || '',
      maxCapacity: classItem.maxCapacity.toString(),
      durationMinutes: classItem.durationMinutes.toString(),
      pricePerSession: classItem.pricePerSession || '',
    });
    setEditingClass(classItem);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClass: Class = {
      id: editingClass?.id || `class-${Date.now()}`,
      centerId: 'center-1',
      name: formData.name,
      description: formData.description,
      classType: formData.classType,
      instructorId: formData.instructorId || undefined,
      maxCapacity: parseInt(formData.maxCapacity),
      durationMinutes: parseInt(formData.durationMinutes),
      pricePerSession: formData.pricePerSession || undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      instructor: instructors.find(i => i.id === formData.instructorId),
    };

    if (editingClass) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? newClass : c));
    } else {
      setClasses(prev => [...prev, newClass]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 수업을 삭제하시겠습니까?')) {
      setClasses(prev => prev.filter(c => c.id !== id));
    }
  };

  const formatPrice = (price?: string) => {
    if (!price) return '무료';
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(parseInt(price));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>수업 관리</CardTitle>
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
          <CardTitle>수업 관리</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                새 수업 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingClass ? '수업 정보 수정' : '새 수업 추가'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">수업명 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="예: CrossFit WOD"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classType">수업 유형</Label>
                    <Input
                      id="classType"
                      value={formData.classType}
                      onChange={(e) => handleInputChange('classType', e.target.value)}
                      placeholder="예: CrossFit, HIIT, Yoga"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">수업 설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="수업에 대한 설명을 입력하세요"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">최대 인원 *</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => handleInputChange('maxCapacity', e.target.value)}
                      placeholder="12"
                      required
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationMinutes">수업 시간 (분) *</Label>
                    <Input
                      id="durationMinutes"
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => handleInputChange('durationMinutes', e.target.value)}
                      placeholder="60"
                      required
                      min="15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerSession">회당 가격 (원)</Label>
                    <Input
                      id="pricePerSession"
                      type="number"
                      value={formData.pricePerSession}
                      onChange={(e) => handleInputChange('pricePerSession', e.target.value)}
                      placeholder="25000"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructorId">담당 강사</Label>
                  <Select value={formData.instructorId} onValueChange={(value) => handleInputChange('instructorId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="강사를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.firstName} {instructor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">
                    {editingClass ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-gray-600">
          센터에서 제공하는 수업을 관리합니다
        </p>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">아직 등록된 수업이 없습니다</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 수업 추가
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{classItem.name}</h3>
                      {classItem.classType && (
                        <Badge variant="outline">{classItem.classType}</Badge>
                      )}
                      <Badge className={classItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {classItem.isActive ? '활성' : '비활성'}
                      </Badge>
                    </div>
                    
                    {classItem.description && (
                      <p className="text-sm text-gray-600 mb-2">{classItem.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        최대 {classItem.maxCapacity}명
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {classItem.durationMinutes}분
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(classItem.pricePerSession)}
                      </span>
                      {classItem.instructor && (
                        <span>
                          강사: {classItem.instructor.firstName} {classItem.instructor.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(classItem)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(classItem.id)}
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