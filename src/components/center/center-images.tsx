'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ImageIcon, Upload, X } from 'lucide-react';
import { mockApiService } from '@/services/mock-data';
import type { Center } from '@/types/database';

export function CenterImages() {
  const [center, setCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    loadCenterData();
  }, []);

  const loadCenterData = async () => {
    try {
      const response = await mockApiService.getCenter();
      if (response.success && response.data) {
        setCenter(response.data);
        setLogoUrl(response.data.logoUrl || '');
        setCoverImageUrl(response.data.coverImageUrl || '');
      }
    } catch (error) {
      console.error('Failed to load center data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!center) return;

    setIsSaving(true);
    try {
      const response = await mockApiService.updateCenter({
        logoUrl: logoUrl || undefined,
        coverImageUrl: coverImageUrl || undefined,
      });
      
      if (response.success) {
        setCenter(response.data);
        console.log('Images updated successfully');
      }
    } catch (error) {
      console.error('Failed to update images:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (type: 'logo' | 'cover') => {
    // In a real implementation, this would handle file upload to cloud storage
    // For now, we'll show a placeholder functionality
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In real app, upload to cloud storage and get URL
        const mockUrl = `https://example.com/uploads/${type}-${Date.now()}.jpg`;
        if (type === 'logo') {
          setLogoUrl(mockUrl);
        } else {
          setCoverImageUrl(mockUrl);
        }
      }
    };
    input.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>센터 이미지</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
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
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5" />
          <span>센터 이미지</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          센터 로고와 커버 이미지를 관리합니다
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">센터 로고</Label>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {logoUrl ? (
                  <div className="relative">
                    <img
                      src={logoUrl}
                      alt="센터 로고"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => setLogoUrl('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="로고 이미지 URL을 입력하거나 업로드하세요"
                />
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileUpload('logo')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    이미지 업로드
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    권장: 512x512px, PNG/JPG
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">커버 이미지</Label>
            <div className="space-y-3">
              {coverImageUrl ? (
                <div className="relative">
                  <img
                    src={coverImageUrl}
                    alt="센터 커버 이미지"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => setCoverImageUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">커버 이미지를 추가하세요</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="커버 이미지 URL을 입력하거나 업로드하세요"
                />
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileUpload('cover')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    이미지 업로드
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    권장: 1200x400px, PNG/JPG
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? '저장 중...' : '이미지 저장'}
            </Button>
          </div>
        </form>

        {/* Image Guidelines */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">이미지 가이드라인</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 로고: 512x512px 정사각형, 투명 배경 권장</li>
            <li>• 커버: 1200x400px 가로형, 센터의 분위기를 잘 나타내는 이미지</li>
            <li>• 파일 크기: 각각 5MB 이하 권장</li>
            <li>• 지원 형식: JPG, PNG, WebP</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}