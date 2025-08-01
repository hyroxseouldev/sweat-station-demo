// Mock data service - easily replaceable with real API calls
import type {
  Center,
  User,
  MembershipType,
  Membership,
  Class,
  ClassSession,
  ClassBooking,
  Payment,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
} from '@/types/database';

// Mock current center - in real app this would come from auth context
const MOCK_CENTER_ID = 'center-1';

// Mock data - Multiple centers
const mockCenters: Center[] = [
  {
    id: MOCK_CENTER_ID,
    clerkOrgId: 'org_mock_12345',
    name: '강남 크로스핏',
    businessRegistrationNumber: '123-45-67890',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    email: 'contact@gangnamcrossfit.com',
    websiteUrl: 'https://gangnamcrossfit.com',
    description: '강남 최고의 크로스핏 박스입니다. 전문 트레이너와 함께 건강한 운동을 시작하세요!',
    vatNumber: 'VAT-123456789',
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '18:00' },
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'center-2',
    clerkOrgId: 'org_mock_12346',
    name: '홍대 요가 스튜디오',
    businessRegistrationNumber: '234-56-78901',
    address: '서울시 마포구 홍익로 45',
    phone: '02-2345-6789',
    email: 'hello@hongdaeyoga.com',
    description: '평온한 마음과 건강한 몸을 위한 요가 스튜디오입니다.',
    vatNumber: 'VAT-234567890',
    operatingHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '21:00' },
      saturday: { open: '09:00', close: '19:00' },
      sunday: null,
    },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'center-3',
    clerkOrgId: 'org_mock_12347',
    name: '분당 헬스클럽',
    businessRegistrationNumber: '345-67-89012',
    address: '경기도 성남시 분당구 정자일로 78',
    phone: '031-3456-7890',
    email: 'info@bundangfitness.com',
    description: '최신 장비와 전문 트레이너가 함께하는 종합 헬스클럽입니다.',
    status: 'trial',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
];

// Legacy support - get first center as default
const mockCenter = mockCenters[0];

const mockUsers: User[] = [
  {
    id: 'user-1',
    centerId: MOCK_CENTER_ID,
    clerkUserId: 'clerk_user_1',
    email: 'admin@gangnamcrossfit.com',
    role: 'center_admin',
    firstName: '김',
    lastName: '관리자',
    phone: '010-1234-5678',
    isActive: true,
    joinedAt: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'user-2',
    centerId: MOCK_CENTER_ID,
    clerkUserId: 'clerk_user_2',
    email: 'trainer@gangnamcrossfit.com',
    role: 'staff',
    firstName: '박',
    lastName: '트레이너',
    phone: '010-2345-6789',
    isActive: true,
    joinedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'member-1',
    centerId: MOCK_CENTER_ID,
    clerkUserId: 'clerk_member_1',
    email: 'john@example.com',
    role: 'member',
    firstName: '이',
    lastName: '회원',
    phone: '010-3456-7890',
    birthDate: '1990-05-15',
    emergencyContactName: '이엄마',
    emergencyContactPhone: '010-9876-5432',
    isActive: true,
    joinedAt: new Date('2024-02-01'),
    lastLoginAt: new Date(),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    id: 'member-2',
    centerId: MOCK_CENTER_ID,
    clerkUserId: 'clerk_member_2',
    email: 'sarah@example.com',
    role: 'member',
    firstName: '최',
    lastName: '회원',
    phone: '010-4567-8901',
    birthDate: '1985-08-22',
    isActive: true,
    joinedAt: new Date('2024-02-15'),
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
  },
];

const mockMembershipTypes: MembershipType[] = [
  {
    id: 'membership-type-1',
    centerId: MOCK_CENTER_ID,
    name: '월 정기권',
    type: 'unlimited_time',
    durationDays: 30,
    price: '150000',
    currency: 'KRW',
    description: '한 달 무제한 이용권',
    allowsPause: true,
    maxPauseDays: 7,
    pauseCostPerDay: '1000',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'membership-type-2',
    centerId: MOCK_CENTER_ID,
    name: '10회 횟수권',
    type: 'limited_sessions',
    sessionCount: 10,
    price: '120000',
    currency: 'KRW',
    description: '10회 이용권 (유효기간 2개월)',
    allowsPause: true,
    maxPauseDays: 14,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'membership-type-3',
    centerId: MOCK_CENTER_ID,
    name: '일일 이용권',
    type: 'day_pass',
    price: '20000',
    currency: 'KRW',
    description: '1일 이용권',
    allowsPause: false,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

const mockMemberships: Membership[] = [
  {
    id: 'membership-1',
    centerId: MOCK_CENTER_ID,
    memberId: 'member-1',
    membershipTypeId: 'membership-type-1',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    sessionsUsed: 0,
    totalPausedDays: 0,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  {
    id: 'membership-2',
    centerId: MOCK_CENTER_ID,
    memberId: 'member-2',
    membershipTypeId: 'membership-type-2',
    status: 'active',
    startDate: '2024-02-15',
    sessionsTotal: 10,
    sessionsUsed: 3,
    totalPausedDays: 0,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
  },
];

const mockClasses: Class[] = [
  {
    id: 'class-1',
    centerId: MOCK_CENTER_ID,
    instructorId: 'user-2',
    name: 'CrossFit WOD',
    description: '크로스핏 기본 워크아웃',
    classType: 'CrossFit',
    maxCapacity: 12,
    durationMinutes: 60,
    pricePerSession: '25000',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'class-2',
    centerId: MOCK_CENTER_ID,
    instructorId: 'user-2',
    name: 'HIIT Training',
    description: '고강도 인터벌 트레이닝',
    classType: 'HIIT',
    maxCapacity: 8,
    durationMinutes: 45,
    pricePerSession: '20000',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

const mockClassSessions: ClassSession[] = [
  {
    id: 'session-1',
    centerId: MOCK_CENTER_ID,
    classId: 'class-1',
    instructorId: 'user-2',
    scheduledDate: '2024-02-20',
    startTime: '07:00',
    endTime: '08:00',
    maxCapacity: 12,
    currentBookings: 8,
    status: 'scheduled',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'session-2',
    centerId: MOCK_CENTER_ID,
    classId: 'class-2',
    instructorId: 'user-2',
    scheduledDate: '2024-02-20',
    startTime: '18:00',
    endTime: '18:45',
    maxCapacity: 8,
    currentBookings: 5,
    status: 'scheduled',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    centerId: MOCK_CENTER_ID,
    memberId: 'member-1',
    membershipId: 'membership-1',
    amount: '150000',
    currency: 'KRW',
    paymentMethod: 'card',
    status: 'completed',
    paymentDate: new Date('2024-02-01'),
    description: '월 정기권 결제',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'payment-2',
    centerId: MOCK_CENTER_ID,
    memberId: 'member-2',
    membershipId: 'membership-2',
    amount: '120000',
    currency: 'KRW',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paymentDate: new Date('2024-02-15'),
    description: '10회 횟수권 결제',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
];

// Mock API Services - these will be easily replaceable with real API calls
export const mockApiService = {
  // Centers
  async getCenters(): Promise<ApiResponse<Center[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: mockCenters,
    };
  },

  async getCenter(centerId?: string): Promise<ApiResponse<Center>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const center = centerId 
      ? mockCenters.find(c => c.id === centerId)
      : mockCenter;
    
    if (!center) {
      return {
        success: false,
        message: 'Center not found',
        data: {} as Center,
      };
    }

    return {
      success: true,
      data: center,
    };
  },

  async createCenter(centerData: Partial<Center>): Promise<ApiResponse<Center>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCenter: Center = {
      id: `center-${Date.now()}`,
      clerkOrgId: centerData.clerkOrgId || `org_${Date.now()}`,
      name: centerData.name || '',
      businessRegistrationNumber: centerData.businessRegistrationNumber,
      address: centerData.address,
      phone: centerData.phone,
      email: centerData.email,
      websiteUrl: centerData.websiteUrl,
      logoUrl: centerData.logoUrl,
      coverImageUrl: centerData.coverImageUrl,
      operatingHours: centerData.operatingHours,
      description: centerData.description,
      vatNumber: centerData.vatNumber,
      bankAccount: centerData.bankAccount,
      status: centerData.status || 'trial',
      stripeCustomerId: centerData.stripeCustomerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCenters.push(newCenter);
    return {
      success: true,
      data: newCenter,
    };
  },

  async updateCenter(updates: Partial<Center>, centerId?: string): Promise<ApiResponse<Center>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const targetCenterId = centerId || MOCK_CENTER_ID;
    const centerIndex = mockCenters.findIndex(c => c.id === targetCenterId);
    
    if (centerIndex === -1) {
      return {
        success: false,
        message: 'Center not found',
        data: {} as Center,
      };
    }

    const updatedCenter = { 
      ...mockCenters[centerIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    mockCenters[centerIndex] = updatedCenter;

    return {
      success: true,
      data: updatedCenter,
    };
  },

  // Members
  async getMembers(page = 1, limit = 50): Promise<PaginatedResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const members = mockUsers.filter(user => user.role === 'member');
    return {
      success: true,
      data: members,
      pagination: {
        page,
        limit,
        total: members.length,
        totalPages: Math.ceil(members.length / limit),
      },
    };
  },

  async getMember(id: string): Promise<ApiResponse<User | null>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const member = mockUsers.find(user => user.id === id);
    return {
      success: true,
      data: member || null,
    };
  },

  async searchMembers(query: string): Promise<ApiResponse<User[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const members = mockUsers.filter(user => 
      user.role === 'member' && 
      (user.firstName?.includes(query) || 
       user.lastName?.includes(query) || 
       user.email.includes(query))
    );
    return {
      success: true,
      data: members,
    };
  },

  // Membership Types
  async getMembershipTypes(): Promise<ApiResponse<MembershipType[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: mockMembershipTypes,
    };
  },

  // Memberships
  async getActiveMemberships(): Promise<ApiResponse<Membership[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const activeMemberships = mockMemberships.map(membership => ({
      ...membership,
      member: mockUsers.find(user => user.id === membership.memberId),
      membershipType: mockMembershipTypes.find(type => type.id === membership.membershipTypeId),
    }));
    return {
      success: true,
      data: activeMemberships,
    };
  },

  // Classes
  async getClasses(): Promise<ApiResponse<Class[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const classesWithInstructor = mockClasses.map(cls => ({
      ...cls,
      instructor: mockUsers.find(user => user.id === cls.instructorId),
    }));
    return {
      success: true,
      data: classesWithInstructor,
    };
  },

  async getUpcomingClassSessions(days = 7): Promise<ApiResponse<ClassSession[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const sessionsWithDetails = mockClassSessions.map(session => ({
      ...session,
      class: mockClasses.find(cls => cls.id === session.classId),
      instructor: mockUsers.find(user => user.id === session.instructorId),
    }));
    return {
      success: true,
      data: sessionsWithDetails,
    };
  },

  // Payments
  async getPaymentHistory(page = 1, limit = 50): Promise<PaginatedResponse<Payment>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const paymentsWithDetails = mockPayments.map(payment => ({
      ...payment,
      member: mockUsers.find(user => user.id === payment.memberId),
      membership: mockMemberships.find(m => m.id === payment.membershipId),
    }));
    return {
      success: true,
      data: paymentsWithDetails,
      pagination: {
        page,
        limit,
        total: paymentsWithDetails.length,
        totalPages: Math.ceil(paymentsWithDetails.length / limit),
      },
    };
  },

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const memberCount = mockUsers.filter(user => user.role === 'member' && user.isActive).length;
    const activeMemberships = mockMemberships.filter(m => m.status === 'active').length;
    const monthlyRevenue = mockPayments
      .filter(p => p.paymentDate.getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + parseInt(p.amount), 0)
      .toString();

    const recentPayments = mockPayments
      .slice(-5)
      .map(payment => ({
        ...payment,
        member: mockUsers.find(user => user.id === payment.memberId),
      }));

    const upcomingClasses = mockClassSessions.map(session => ({
      ...session,
      class: mockClasses.find(cls => cls.id === session.classId)!,
      instructor: mockUsers.find(user => user.id === session.instructorId),
    }));

    const membershipTypeStats = mockMembershipTypes.map(type => ({
      membershipType: type,
      activeMemberships: mockMemberships.filter(m => 
        m.membershipTypeId === type.id && m.status === 'active'
      ).length,
      totalRevenue: mockPayments
        .filter(p => mockMemberships.find(m => m.id === p.membershipId)?.membershipTypeId === type.id)
        .reduce((sum, p) => sum + parseInt(p.amount), 0)
        .toString(),
    }));

    return {
      success: true,
      data: {
        memberCount,
        activeMemberships,
        monthlyRevenue,
        recentPayments,
        upcomingClasses,
        membershipTypeStats,
      },
    };
  },
};