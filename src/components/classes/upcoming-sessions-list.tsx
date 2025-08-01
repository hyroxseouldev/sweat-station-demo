'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Users, Edit, Trash2, Eye } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { ClassSession, Class } from '@/types/database';

export function UpcomingSessionsList() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [formData, setFormData] = useState({
    classId: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    maxCapacity: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsResponse, classesResponse] = await Promise.all([
        mockApiService.getUpcomingClassSessions(7),
        mockApiService.getClasses()
      ]);

      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data);
      }

      if (classesResponse.success) {
        setClasses(classesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-fill end time and capacity when class is selected
    if (field === 'classId') {
      const selectedClass = classes.find(c => c.id === value);
      if (selectedClass && formData.startTime) {
        const startTime = new Date(`1970-01-01T${formData.startTime}:00`);
        const endTime = new Date(startTime.getTime() + selectedClass.durationMinutes * 60000);
        const endTimeString = endTime.toTimeString().slice(0, 5);
        
        setFormData(prev => ({
          ...prev,
          endTime: endTimeString,
          maxCapacity: selectedClass.maxCapacity.toString(),
        }));
      }
    }

    // Auto-calculate end time when start time changes
    if (field === 'startTime' && formData.classId) {
      const selectedClass = classes.find(c => c.id === formData.classId);
      if (selectedClass) {
        const startTime = new Date(`1970-01-01T${value}:00`);
        const endTime = new Date(startTime.getTime() + selectedClass.durationMinutes * 60000);
        const endTimeString = endTime.toTimeString().slice(0, 5);
        
        setFormData(prev => ({ ...prev, endTime: endTimeString }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      classId: '',
      scheduledDate: '',
      startTime: '',
      endTime: '',
      maxCapacity: '',
      notes: '',
    });
    setEditingSession(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (session: ClassSession) => {
    setFormData({
      classId: session.classId,
      scheduledDate: session.scheduledDate,
      startTime: session.startTime,
      endTime: session.endTime,
      maxCapacity: session.maxCapacity.toString(),
      notes: session.notes || '',
    });
    setEditingSession(session);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClass = classes.find(c => c.id === formData.classId);
    const newSession: ClassSession = {
      id: editingSession?.id || `session-${Date.now()}`,
      centerId: 'center-1',
      classId: formData.classId,
      instructorId: selectedClass?.instructorId,
      scheduledDate: formData.scheduledDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      maxCapacity: parseInt(formData.maxCapacity),
      currentBookings: editingSession?.currentBookings || 0,
      status: 'scheduled',
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      class: selectedClass,
      instructor: selectedClass?.instructor,
    };

    if (editingSession) {
      setSessions(prev => prev.map(s => s.id === editingSession.id ? newSession : s));
    } else {
      setSessions(prev => [...prev, newSession]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 세션을 삭제하시겠습니까? 예약된 회원들에게 알림이 전송됩니다.')) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">예정</Badge>;
      case 'in_progress':
        return <Badge className="bg-green-100 text-green-800">진행중</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">완료</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">취소</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getCapacityStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return 'full';
    if (percentage >= 80) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  };

  const getCapacityColor = (status: string) => {
    switch (status) {
      case 'full': return 'text-red-600';
      case 'high': return 'text-yellow-600';
      case 'medium': return 'text-blue-600';
      default: return 'text-green-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>예정된 세션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
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
            <Calendar className="h-5 w-5" />
            <span>예정된 세션</span>
            <Badge variant="secondary">{sessions.length}</Badge>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                세션 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingSession ? '세션 정보 수정' : '새 세션 추가'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="classId">수업 선택 *</Label>
                  <Select value={formData.classId} onValueChange={(value) => handleInputChange('classId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="수업을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">날짜 *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">시작 시간 *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">종료 시간 *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCapacity">최대 인원 *</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => handleInputChange('maxCapacity', e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">참고사항</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="세션 관련 참고사항"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button type="submit">
                    {editingSession ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-gray-600">
          향후 7일간 예정된 수업 세션입니다
        </p>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">예정된 세션이 없습니다</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              첫 번째 세션 추가
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{session.class?.name}</h3>
                      {getStatusBadge(session.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(session.scheduledDate)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </span>
                      <span className={`flex items-center ${getCapacityColor(getCapacityStatus(session.currentBookings, session.maxCapacity))}`}>
                        <Users className="h-4 w-4 mr-1" />
                        {session.currentBookings} / {session.maxCapacity}
                      </span>
                      {session.instructor && (
                        <span>
                          {session.instructor.firstName} {session.instructor.lastName}
                        </span>
                      )}
                    </div>

                    {session.notes && (
                      <p className="text-xs text-gray-500 mt-1">{session.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" title="예약 현황 보기">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(session)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(session.id)}
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