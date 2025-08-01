'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  CreditCard, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Webhook,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  enabled: boolean;
  config?: Record<string, string>;
}

export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: '결제 처리 및 구독 관리',
      icon: <CreditCard className="h-4 w-4" />,
      connected: true,
      enabled: true,
      config: {
        publishableKey: 'pk_test_***************',
        webhookUrl: 'https://api.sweatstation.com/webhooks/stripe',
      }
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: '수업 일정을 Google Calendar와 동기화',
      icon: <Calendar className="h-4 w-4" />,
      connected: false,
      enabled: false,
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: '이메일 마케팅 및 뉴스레터',
      icon: <Mail className="h-4 w-4" />,
      connected: true,
      enabled: false,
      config: {
        apiKey: 'mc_***************',
        listId: 'abc123',
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      description: '팀 커뮤니케이션 및 알림',
      icon: <MessageSquare className="h-4 w-4" />,
      connected: false,
      enabled: false,
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: '다양한 앱과의 자동화 워크플로',
      icon: <Zap className="h-4 w-4" />,
      connected: false,
      enabled: false,
    },
  ]);

  const [webhookSettings, setWebhookSettings] = useState({
    enabled: true,
    url: 'https://api.example.com/webhooks/sweatstation',
    secret: 'webhook_secret_key',
    events: {
      memberCreated: true,
      memberUpdated: false,
      paymentCompleted: true,
      classBooked: false,
      membershipExpired: true,
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, enabled }
        : integration
    ));
  };

  const handleConnectIntegration = async (id: string) => {
    try {
      // In real implementation, this would redirect to OAuth flow
      console.log(`Connecting to ${id}`);
      
      // Mock successful connection
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, connected: true }
          : integration
      ));
    } catch (error) {
      console.error(`Failed to connect ${id}:`, error);
    }
  };

  const handleDisconnectIntegration = async (id: string) => {
    if (confirm('정말로 이 연동을 해제하시겠습니까?')) {
      try {
        // In real implementation, this would revoke tokens
        console.log(`Disconnecting from ${id}`);
        
        setIntegrations(prev => prev.map(integration => 
          integration.id === id 
            ? { ...integration, connected: false, enabled: false }
            : integration
        ));
      } catch (error) {
        console.error(`Failed to disconnect ${id}:`, error);
      }
    }
  };

  const handleWebhookSettingChange = (key: string, value: string | boolean) => {
    if (key.startsWith('events.')) {
      const eventKey = key.split('.')[1];
      setWebhookSettings(prev => ({
        ...prev,
        events: {
          ...prev.events,
          [eventKey]: value,
        }
      }));
    } else {
      setWebhookSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In real implementation, this would save to API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Integration settings saved:', { integrations, webhookSettings });
    } catch (error) {
      console.error('Failed to save integration settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (integration: Integration) => {
    if (!integration.connected) {
      return <Badge variant="outline" className="text-gray-600">연결 안됨</Badge>;
    }
    if (!integration.enabled) {
      return <Badge variant="outline" className="text-yellow-600">연결됨</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">활성</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>연동 설정</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          외부 서비스와의 연동을 관리합니다
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Integrations List */}
        <div className="space-y-4">
          <h3 className="font-medium">서비스 연동</h3>
          
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{integration.name}</h4>
                      {getStatusBadge(integration)}
                    </div>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {integration.connected && (
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={(enabled) => handleToggleIntegration(integration.id, enabled)}
                    />
                  )}
                  
                  {integration.connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectIntegration(integration.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      연결 해제
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnectIntegration(integration.id)}
                    >
                      연결
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center space-x-2">
              <Webhook className="h-4 w-4" />
              <span>웹훅 설정</span>
            </h3>
            <Switch
              checked={webhookSettings.enabled}
              onCheckedChange={(enabled) => handleWebhookSettingChange('enabled', enabled)}
            />
          </div>
          
          {webhookSettings.enabled && (
            <div className="space-y-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">웹훅 URL</Label>
                <Input
                  id="webhook-url"
                  value={webhookSettings.url}
                  onChange={(e) => handleWebhookSettingChange('url', e.target.value)}
                  placeholder="https://your-app.com/webhooks"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-secret">시크릿 키</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  value={webhookSettings.secret}
                  onChange={(e) => handleWebhookSettingChange('secret', e.target.value)}
                  placeholder="webhook_secret_key"
                />
              </div>
              
              <div className="space-y-3">
                <Label>웹훅 이벤트</Label>
                <div className="space-y-2">
                  {Object.entries(webhookSettings.events).map(([event, enabled]) => (
                    <div key={event} className="flex items-center justify-between">
                      <Label className="text-sm">{getEventLabel(event)}</Label>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => handleWebhookSettingChange(`events.${event}`, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Keys Section */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>API 설정</span>
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Label>API 키</Label>
              <Button variant="outline" size="sm">새 키 생성</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                value="sk_live_************************"
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="sm">복사</Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              마지막 사용: 2024년 2월 20일
            </p>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🔗 연동 상태</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-blue-800">활성 연동: {integrations.filter(i => i.enabled).length}개</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-gray-600" />
              <span className="text-blue-800">비활성: {integrations.filter(i => !i.enabled).length}개</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? '저장 중...' : '연동 설정 저장'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getEventLabel(event: string): string {
  const labels: Record<string, string> = {
    memberCreated: '회원 가입',
    memberUpdated: '회원 정보 업데이트',
    paymentCompleted: '결제 완료',
    classBooked: '수업 예약',
    membershipExpired: '멤버십 만료',
  };
  
  return labels[event] || event;
}