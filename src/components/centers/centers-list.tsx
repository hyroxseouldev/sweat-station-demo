'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, MapPin, Phone, Users, Calendar, Settings } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import { AddCenterDialog } from './add-center-dialog';
import type { Center } from '@/types/database';

interface CenterCardProps {
  center: Center;
  onManageCenter: (centerId: string) => void;
}

function CenterCard({ center, onManageCenter }: CenterCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'trial':
        return <Badge variant="outline" className="text-blue-600">체험</Badge>;
      case 'suspended':
        return <Badge variant="destructive">중단</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {center.logoUrl ? (
                <img 
                  src={center.logoUrl} 
                  alt={center.name}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {center.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {center.description || '센터 설명이 없습니다'}
              </p>
            </div>
          </div>
          {getStatusBadge(center.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Center Info */}
        <div className="space-y-2">
          {center.address && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{center.address}</span>
            </div>
          )}
          {center.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{center.phone}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-sm font-medium">125</div>
            <div className="text-xs text-gray-500">회원</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-sm font-medium">24</div>
            <div className="text-xs text-gray-500">수업</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Settings className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-sm font-medium">
              {center.operatingHours ? Object.keys(center.operatingHours).length : 0}
            </div>
            <div className="text-xs text-gray-500">운영일</div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onManageCenter(center.id)}
          className="w-full mt-4"
          variant="outline"
        >
          센터 관리
        </Button>
      </CardContent>
    </Card>
  );
}

export function CentersList() {
  const router = useRouter();
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      // In a real app, this would fetch all centers for the current user/org
      const response = await mockApiService.getCenters();
      if (response.success) {
        setCenters(response.data);
      }
    } catch (error) {
      console.error('Failed to load centers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageCenter = (centerId: string) => {
    router.push(`/dashboard/${centerId}`);
  };

  const handleAddCenter = async (centerData: Partial<Center>) => {
    try {
      const response = await mockApiService.createCenter(centerData);
      if (response.success) {
        setCenters(prev => [...prev, response.data]);
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to create center:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-36" />
                <div className="h-8 bg-gray-200 rounded w-full mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Center Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          새 센터 추가
        </Button>
      </div>

      {/* Centers Grid */}
      {centers.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            등록된 센터가 없습니다
          </h3>
          <p className="text-gray-500 mb-6">
            첫 번째 센터를 추가하여 시작하세요
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            센터 추가하기
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <CenterCard
              key={center.id}
              center={center}
              onManageCenter={handleManageCenter}
            />
          ))}
        </div>
      )}

      {/* Add Center Dialog */}
      <AddCenterDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddCenter={handleAddCenter}
      />
    </div>
  );
}