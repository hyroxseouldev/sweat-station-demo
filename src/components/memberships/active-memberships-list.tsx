'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Calendar,
  Clock,
  Hash,
  AlertCircle 
} from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { Membership } from '@/types/database';

export function ActiveMembershipsList() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [filteredMemberships, setFilteredMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadActiveMemberships();
  }, []);

  useEffect(() => {
    filterMemberships();
  }, [memberships, searchTerm]);

  const loadActiveMemberships = async () => {
    try {
      const response = await mockApiService.getActiveMemberships();
      if (response.success) {
        setMemberships(response.data);
      }
    } catch (error) {
      console.error('Failed to load active memberships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMemberships = () => {
    if (!searchTerm) {
      setFilteredMemberships(memberships);
      return;
    }

    const filtered = memberships.filter(membership => {
      const memberName = `${membership.member?.firstName} ${membership.member?.lastName}`.toLowerCase();
      const memberEmail = membership.member?.email?.toLowerCase() || '';
      const membershipTypeName = membership.membershipType?.name?.toLowerCase() || '';
      
      return (
        memberName.includes(searchTerm.toLowerCase()) ||
        memberEmail.includes(searchTerm.toLowerCase()) ||
        membershipTypeName.includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredMemberships(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">일시정지</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">만료</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">취소</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSessionProgress = (used: number, total?: number) => {
    if (!total) return 0;
    return (used / total) * 100;
  };

  const isExpiringSoon = (endDate?: string) => {
    const daysRemaining = getDaysRemaining(endDate);
    return daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;
  };

  const isExpired = (endDate?: string) => {
    const daysRemaining = getDaysRemaining(endDate);
    return daysRemaining !== null && daysRemaining < 0;
  };

  const handleViewDetail = (membership: Membership) => {
    setSelectedMembership(membership);
    setIsDetailOpen(true);
  };

  const handlePauseMembership = async (membershipId: string) => {
    // In real implementation, this would call the API
    setMemberships(prev => prev.map(m => 
      m.id === membershipId 
        ? { ...m, status: 'paused' as const }
        : m
    ));
  };

  const handleResumeMembership = async (membershipId: string) => {
    // In real implementation, this would call the API
    setMemberships(prev => prev.map(m => 
      m.id === membershipId 
        ? { ...m, status: 'active' as const }
        : m
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>활성 멤버십</CardTitle>
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>활성 멤버십</span>
            <Badge variant="secondary">{filteredMemberships.length}</Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            현재 활성 상태인 멤버십을 관리합니다
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="회원명, 이메일, 멤버십 유형으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Memberships List */}
          {filteredMemberships.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? '검색 결과가 없습니다' : '활성 멤버십이 없습니다'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMemberships.map((membership) => (
                <div
                  key={membership.id}
                  className={`border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                    isExpired(membership.endDate) ? 'border-red-200 bg-red-50' :
                    isExpiringSoon(membership.endDate) ? 'border-yellow-200 bg-yellow-50' : ''
                  }`}
                  onClick={() => handleViewDetail(membership)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={membership.member?.profileImageUrl} />
                        <AvatarFallback>
                          {membership.member?.firstName?.[0]}{membership.member?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium truncate">
                            {membership.member?.firstName} {membership.member?.lastName}
                          </p>
                          {getStatusBadge(membership.status)}
                          {isExpiringSoon(membership.endDate) && (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                          {isExpired(membership.endDate) && (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-500 truncate">
                          {membership.membershipType?.name}
                        </p>
                        
                        {/* Progress for session-based memberships */}
                        {membership.sessionsTotal && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>이용 횟수</span>
                              <span>{membership.sessionsUsed} / {membership.sessionsTotal}</span>
                            </div>
                            <Progress 
                              value={getSessionProgress(membership.sessionsUsed, membership.sessionsTotal)} 
                              className="h-1.5"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {membership.endDate && (
                        <div className="text-xs text-gray-500 mb-1">
                          {isExpired(membership.endDate) ? (
                            <span className="text-red-600 font-medium">만료</span>
                          ) : (
                            <span>
                              {getDaysRemaining(membership.endDate)}일 남음
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-1">
                        {membership.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePauseMembership(membership.id);
                            }}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        ) : membership.status === 'paused' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResumeMembership(membership.id);
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        ) : null}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(membership);
                          }}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Membership Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>멤버십 상세 정보</DialogTitle>
          </DialogHeader>
          
          {selectedMembership && (
            <div className="space-y-6">
              {/* Member Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMembership.member?.profileImageUrl} />
                  <AvatarFallback className="text-lg">
                    {selectedMembership.member?.firstName?.[0]}{selectedMembership.member?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedMembership.member?.firstName} {selectedMembership.member?.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedMembership.member?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(selectedMembership.status)}
                  </div>
                </div>
              </div>

              {/* Membership Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">멤버십 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">유형:</span>
                      <span>{selectedMembership.membershipType?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">시작일:</span>
                      <span>{formatDate(selectedMembership.startDate)}</span>
                    </div>
                    {selectedMembership.endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">종료일:</span>
                        <span>{formatDate(selectedMembership.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">이용 현황</h4>
                  <div className="space-y-2 text-sm">
                    {selectedMembership.sessionsTotal ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">이용 횟수:</span>
                          <span>{selectedMembership.sessionsUsed} / {selectedMembership.sessionsTotal}</span>
                        </div>
                        <Progress 
                          value={getSessionProgress(selectedMembership.sessionsUsed, selectedMembership.sessionsTotal)} 
                          className="h-2"
                        />
                      </>
                    ) : selectedMembership.endDate ? (
                      <div className="flex justify-between">
                        <span className="text-gray-600">남은 기간:</span>
                        <span>
                          {getDaysRemaining(selectedMembership.endDate)}일
                        </span>
                      </div>
                    ) : null}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">일시정지:</span>
                      <span>{selectedMembership.totalPausedDays}일</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t">
                {selectedMembership.status === 'active' ? (
                  <Button 
                    variant="outline"
                    onClick={() => handlePauseMembership(selectedMembership.id)}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    일시정지
                  </Button>
                ) : selectedMembership.status === 'paused' ? (
                  <Button 
                    variant="outline"
                    onClick={() => handleResumeMembership(selectedMembership.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    재개
                  </Button>
                ) : null}
                
                <Button variant="outline">
                  결제 내역 보기
                </Button>
                <Button variant="outline">
                  멤버 프로필 보기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}