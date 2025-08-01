'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Search, 
  Check, 
  X, 
  Clock,
  Users,
  Filter
} from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { ClassBooking, ClassSession, Class, User } from '@/types/database';

// Mock booking data
const mockBookings: (ClassBooking & { 
  member: User; 
  classSession: ClassSession & { class: Class } 
})[] = [
  {
    id: 'booking-1',
    centerId: 'center-1',
    classSessionId: 'session-1',
    memberId: 'member-1',
    bookingStatus: 'booked',
    bookedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    member: {
      id: 'member-1',
      centerId: 'center-1',
      clerkUserId: 'clerk_member_1',
      email: 'john@example.com',
      role: 'member',
      firstName: '이',
      lastName: '회원',
      phone: '010-3456-7890',
      isActive: true,
      joinedAt: new Date('2024-02-01'),
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date(),
    },
    classSession: {
      id: 'session-1',
      centerId: 'center-1',
      classId: 'class-1',
      scheduledDate: '2024-02-20',
      startTime: '07:00',
      endTime: '08:00',
      maxCapacity: 12,
      currentBookings: 8,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
      class: {
        id: 'class-1',
        centerId: 'center-1',
        name: 'CrossFit WOD',
        classType: 'CrossFit',
        maxCapacity: 12,
        durationMinutes: 60,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  },
  {
    id: 'booking-2',
    centerId: 'center-1',
    classSessionId: 'session-2',
    memberId: 'member-2',
    bookingStatus: 'attended',
    bookedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    attendedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    member: {
      id: 'member-2',
      centerId: 'center-1',
      clerkUserId: 'clerk_member_2',
      email: 'sarah@example.com',
      role: 'member',
      firstName: '최',
      lastName: '회원',
      phone: '010-4567-8901',
      isActive: true,
      joinedAt: new Date('2024-02-15'),
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date(),
    },
    classSession: {
      id: 'session-2',
      centerId: 'center-1',
      classId: 'class-2',
      scheduledDate: '2024-02-19',
      startTime: '18:00',
      endTime: '18:45',
      maxCapacity: 8,
      currentBookings: 5,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      class: {
        id: 'class-2',
        centerId: 'center-1',
        name: 'HIIT Training',
        classType: 'HIIT',
        maxCapacity: 8,
        durationMinutes: 45,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  }
];

export function ClassBookingsList() {
  const [bookings, setBookings] = useState<typeof mockBookings>([]);
  const [filteredBookings, setFilteredBookings] = useState<typeof mockBookings>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = async () => {
    try {
      // In real implementation, this would call API
      await new Promise(resolve => setTimeout(resolve, 300));
      setBookings(mockBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => {
        const memberName = `${booking.member.firstName} ${booking.member.lastName}`.toLowerCase();
        const memberEmail = booking.member.email.toLowerCase();
        const className = booking.classSession.class.name.toLowerCase();
        
        return (
          memberName.includes(searchTerm.toLowerCase()) ||
          memberEmail.includes(searchTerm.toLowerCase()) ||
          className.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.bookingStatus === statusFilter);
    }

    // Sort by booking date (newest first)
    filtered.sort((a, b) => b.bookedAt.getTime() - a.bookedAt.getTime());

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-blue-100 text-blue-800">예약</Badge>;
      case 'attended':
        return <Badge className="bg-green-100 text-green-800">참석</Badge>;
      case 'no_show':
        return <Badge className="bg-yellow-100 text-yellow-800">결석</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">취소</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleMarkAttendance = async (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, bookingStatus: 'attended' as const, attendedAt: new Date() }
        : booking
    ));
  };

  const handleMarkNoShow = async (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, bookingStatus: 'no_show' as const }
        : booking
    ));
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('정말로 이 예약을 취소하시겠습니까?')) {
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, bookingStatus: 'cancelled' as const, cancelledAt: new Date() }
          : booking
      ));
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatSessionDateTime = (date: string, startTime: string) => {
    const sessionDate = new Date(date);
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    }).format(sessionDate) + ` ${startTime.slice(0, 5)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 예약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
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
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>최근 예약</span>
          <Badge variant="secondary">{filteredBookings.length}</Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          최근 수업 예약 및 출석 현황입니다
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="회원명, 이메일, 수업명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex space-x-2">
              {[
                { value: 'all', label: '전체' },
                { value: 'booked', label: '예약' },
                { value: 'attended', label: '참석' },
                { value: 'no_show', label: '결석' },
                { value: 'cancelled', label: '취소' },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' ? '검색 결과가 없습니다' : '예약 내역이 없습니다'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.member.profileImageUrl} />
                      <AvatarFallback>
                        {booking.member.firstName?.[0]}{booking.member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium truncate">
                          {booking.member.firstName} {booking.member.lastName}
                        </p>
                        {getStatusBadge(booking.bookingStatus)}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{booking.classSession.class.name}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatSessionDateTime(booking.classSession.scheduledDate, booking.classSession.startTime)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-400">
                        예약일: {formatDate(booking.bookedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {booking.bookingStatus === 'booked' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAttendance(booking.id)}
                          title="출석 처리"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkNoShow(booking.id)}
                          title="결석 처리"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    
                    {booking.bookingStatus === 'booked' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-700"
                        title="예약 취소"
                      >
                        취소
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {filteredBookings.length > 0 && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {filteredBookings.filter(b => b.bookingStatus === 'attended').length}
                </p>
                <p className="text-xs text-gray-500">출석</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredBookings.filter(b => b.bookingStatus === 'no_show').length}
                </p>
                <p className="text-xs text-gray-500">결석</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}