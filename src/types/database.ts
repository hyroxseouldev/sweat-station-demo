// Mock data types matching database schema for easy API integration later

export interface Center {
  id: string;
  clerkOrgId: string;
  name: string;
  businessRegistrationNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  operatingHours?: {
    [key: string]: { open: string; close: string } | null;
  };
  description?: string;
  vatNumber?: string;
  bankAccount?: string;
  status: 'active' | 'suspended' | 'trial';
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  centerId: string;
  clerkUserId: string;
  email: string;
  role: 'center_admin' | 'staff' | 'member';
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string;
  profileImageUrl?: string;
  joinedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipType {
  id: string;
  centerId: string;
  name: string;
  type: 'unlimited_time' | 'limited_sessions' | 'day_pass';
  durationDays?: number;
  sessionCount?: number;
  price: string;
  currency: string;
  description?: string;
  termsAndConditions?: string;
  allowsPause: boolean;
  maxPauseDays?: number;
  pauseCostPerDay?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  centerId: string;
  memberId: string;
  membershipTypeId: string;
  status: 'active' | 'paused' | 'expired' | 'cancelled';
  startDate: string;
  endDate?: string;
  sessionsTotal?: number;
  sessionsUsed: number;
  totalPausedDays: number;
  stripeSubscriptionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations for UI
  member?: User;
  membershipType?: MembershipType;
}

export interface Class {
  id: string;
  centerId: string;
  instructorId?: string;
  name: string;
  description?: string;
  classType?: string;
  maxCapacity: number;
  durationMinutes: number;
  pricePerSession?: string;
  recurringSchedule?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  instructor?: User;
}

export interface ClassSession {
  id: string;
  centerId: string;
  classId: string;
  instructorId?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBookings: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  class?: Class;
  instructor?: User;
  bookings?: ClassBooking[];
}

export interface ClassBooking {
  id: string;
  centerId: string;
  classSessionId: string;
  memberId: string;
  membershipId?: string;
  bookingStatus: 'booked' | 'attended' | 'no_show' | 'cancelled';
  bookedAt: Date;
  cancelledAt?: Date;
  attendedAt?: Date;
  waitlistPosition?: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  member?: User;
  membership?: Membership;
}

export interface Payment {
  id: string;
  centerId: string;
  memberId: string;
  membershipId?: string;
  amount: string;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'other';
  stripePaymentIntentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  member?: User;
  membership?: Membership;
}

export interface Subscription {
  id: string;
  centerId: string;
  planType: 'free' | 'premium';
  stripeSubscriptionId?: string;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  memberCount: number;
  amount?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  centerId: string;
  title: string;
  content: string;
  authorId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  targetAudience: 'all' | 'members' | 'staff';
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  author?: User;
}

// Dashboard Analytics Types
export interface DashboardStats {
  memberCount: number;
  activeMemberships: number;
  monthlyRevenue: string;
  recentPayments: Payment[];
  upcomingClasses: (ClassSession & { class: Class; instructor?: User })[];
  membershipTypeStats: {
    membershipType: MembershipType;
    activeMemberships: number;
    totalRevenue: string;
  }[];
}

// API Response Types (for easy migration to real API)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}