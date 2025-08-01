'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Building2, Home } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import type { Center } from '@/types/database';

interface CenterBreadcrumbProps {
  centerId: string;
  currentPage?: string;
}

export function CenterBreadcrumb({ centerId, currentPage }: CenterBreadcrumbProps) {
  const [center, setCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCenter();
  }, [centerId]);

  const loadCenter = async () => {
    try {
      const response = await mockApiService.getCenter(centerId);
      if (response.success) {
        setCenter(response.data);
      }
    } catch (error) {
      console.error('Failed to load center:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Skeleton className="h-4 w-20" />
        <ChevronRight className="w-4 h-4" />
        <Skeleton className="h-4 w-32" />
        {currentPage && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
          </>
        )}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      <Link href="/dashboard" className="flex items-center hover:text-gray-700 transition-colors">
        <Home className="w-4 h-4 mr-1" />
        센터 목록
      </Link>
      
      <ChevronRight className="w-4 h-4" />
      
      <Link 
        href={`/dashboard/${centerId}`} 
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Building2 className="w-4 h-4 mr-1" />
        {center?.name || '센터'}
      </Link>
      
      {currentPage && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{currentPage}</span>
        </>
      )}
    </nav>
  );
}