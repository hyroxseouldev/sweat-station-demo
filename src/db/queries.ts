import { eq, and, desc, asc, gte, lte, isNull, count, sum, sql } from "drizzle-orm";
import { db } from "./index";
import {
  centers,
  users,
  memberships,
  membershipTypes,
  classes,
  classSessions,
  classBookings,
  payments,
  subscriptions,
  membershipPausePeriods,
  type Center,
  type User,
} from "./schema";

/**
 * TENANT ISOLATION UTILITIES
 * All queries MUST include center_id filtering for data isolation
 */

export class TenantContext {
  constructor(public readonly centerId: string) {}

  /**
   * Validates that the user belongs to this tenant
   */
  async validateUserAccess(clerkUserId: string): Promise<User | null> {
    const user = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.centerId, this.centerId),
          eq(users.clerkUserId, clerkUserId),
          eq(users.isActive, true)
        )
      )
      .limit(1);

    return user[0] || null;
  }

  /**
   * Gets center information
   */
  async getCenter(): Promise<Center | null> {
    const center = await db
      .select()
      .from(centers)
      .where(eq(centers.id, this.centerId))
      .limit(1);

    return center[0] || null;
  }
}

/**
 * CENTER MANAGEMENT QUERIES
 */

export const centerQueries = {
  /**
   * Create a new center (used during onboarding)
   */
  async createCenter(data: {
    clerkOrgId: string;
    name: string;
    email: string;
    businessRegistrationNumber?: string;
    address?: string;
    phone?: string;
  }) {
    return await db.insert(centers).values({
      clerkOrgId: data.clerkOrgId,
      name: data.name,
      email: data.email,
      businessRegistrationNumber: data.businessRegistrationNumber,
      address: data.address,
      phone: data.phone,
      status: "trial",
    }).returning();
  },

  /**
   * Update center information
   */
  async updateCenter(centerId: string, updates: Partial<Center>) {
    return await db
      .update(centers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(centers.id, centerId))
      .returning();
  },

  /**
   * Get center by Clerk organization ID
   */
  async getCenterByClerkOrgId(clerkOrgId: string): Promise<Center | null> {
    const center = await db
      .select()
      .from(centers)
      .where(eq(centers.clerkOrgId, clerkOrgId))
      .limit(1);

    return center[0] || null;
  },

  /**
   * Get center stats (member count, active memberships, etc.)
   */
  async getCenterStats(centerId: string) {
    const [memberCount] = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.centerId, centerId),
          eq(users.role, "member"),
          eq(users.isActive, true)
        )
      );

    const [activeMemberships] = await db
      .select({ count: count() })
      .from(memberships)
      .where(
        and(
          eq(memberships.centerId, centerId),
          eq(memberships.status, "active")
        )
      );

    const [monthlyRevenue] = await db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(
        and(
          eq(payments.centerId, centerId),
          eq(payments.status, "completed"),
          gte(payments.paymentDate, new Date(new Date().getFullYear(), new Date().getMonth(), 1))
        )
      );

    return {
      memberCount: memberCount.count,
      activeMemberships: activeMemberships.count,
      monthlyRevenue: monthlyRevenue.total || "0",
    };
  },
};

/**
 * USER MANAGEMENT QUERIES
 */

export const userQueries = {
  /**
   * Create a new user (admin, staff, or member)
   */
  async createUser(centerId: string, data: {
    clerkUserId: string;
    email: string;
    role: "center_admin" | "staff" | "member";
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    return await db.insert(users).values({
      centerId,
      clerkUserId: data.clerkUserId,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    }).returning();
  },

  /**
   * Get all members for a center (with pagination)
   */
  async getMembers(centerId: string, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    return await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        joinedAt: users.joinedAt,
        lastLoginAt: users.lastLoginAt,
        isActive: users.isActive,
      })
      .from(users)
      .where(
        and(
          eq(users.centerId, centerId),
          eq(users.role, "member")
        )
      )
      .orderBy(desc(users.joinedAt))
      .limit(limit)
      .offset(offset);
  },

  /**
   * Get user with their active memberships
   */
  async getUserWithMemberships(centerId: string, userId: string) {
    return await db
      .select({
        user: users,
        membership: memberships,
        membershipType: membershipTypes,
      })
      .from(users)
      .leftJoin(memberships, eq(users.id, memberships.memberId))
      .leftJoin(membershipTypes, eq(memberships.membershipTypeId, membershipTypes.id))
      .where(
        and(
          eq(users.centerId, centerId),
          eq(users.id, userId)
        )
      );
  },

  /**
   * Search members by name or email
   */
  async searchMembers(centerId: string, searchTerm: string) {
    return await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.centerId, centerId),
          eq(users.role, "member"),
          eq(users.isActive, true),
          sql`LOWER(${users.firstName} || ' ' || ${users.lastName} || ' ' || ${users.email}) LIKE LOWER('%' || ${searchTerm} || '%')`
        )
      )
      .orderBy(asc(users.firstName))
      .limit(20);
  },
};

/**
 * MEMBERSHIP MANAGEMENT QUERIES
 */

export const membershipQueries = {
  /**
   * Create a new membership type
   */
  async createMembershipType(centerId: string, data: {
    name: string;
    type: "unlimited_time" | "limited_sessions" | "day_pass";
    durationDays?: number;
    sessionCount?: number;
    price: string;
    description?: string;
    allowsPause?: boolean;
    maxPauseDays?: number;
    pauseCostPerDay?: string;
  }) {
    return await db.insert(membershipTypes).values({
      centerId,
      ...data,
    }).returning();
  },

  /**
   * Get all membership types for a center
   */
  async getMembershipTypes(centerId: string) {
    return await db
      .select()
      .from(membershipTypes)
      .where(
        and(
          eq(membershipTypes.centerId, centerId),
          eq(membershipTypes.isActive, true)
        )
      )
      .orderBy(asc(membershipTypes.price));
  },

  /**
   * Create a new membership for a member
   */
  async createMembership(centerId: string, data: {
    memberId: string;
    membershipTypeId: string;
    startDate: string;
    endDate?: string;
    sessionsTotal?: number;
    stripeSubscriptionId?: string;
  }) {
    return await db.insert(memberships).values({
      centerId,
      ...data,
    }).returning();
  },

  /**
   * Get active memberships with member and type details
   */
  async getActiveMemberships(centerId: string) {
    return await db
      .select({
        membership: memberships,
        member: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        membershipType: membershipTypes,
      })
      .from(memberships)
      .innerJoin(users, eq(memberships.memberId, users.id))
      .innerJoin(membershipTypes, eq(memberships.membershipTypeId, membershipTypes.id))
      .where(
        and(
          eq(memberships.centerId, centerId),
          eq(memberships.status, "active")
        )
      )
      .orderBy(desc(memberships.createdAt));
  },

  /**
   * Pause a membership
   */
  async pauseMembership(centerId: string, membershipId: string, reason: string, createdBy: string) {
    // Start transaction
    return await db.transaction(async (tx) => {
      // Update membership status
      await tx
        .update(memberships)
        .set({ status: "paused", updatedAt: new Date() })
        .where(
          and(
            eq(memberships.centerId, centerId),
            eq(memberships.id, membershipId)
          )
        );

      // Create pause period record
      await tx.insert(membershipPausePeriods).values({
        centerId,
        membershipId,
        startDate: new Date().toISOString().split('T')[0],
        reason,
        createdBy,
      });
    });
  },

  /**
   * Resume a paused membership
   */
  async resumeMembership(centerId: string, membershipId: string) {
    return await db.transaction(async (tx) => {
      // Update membership status
      await tx
        .update(memberships)
        .set({ status: "active", updatedAt: new Date() })
        .where(
          and(
            eq(memberships.centerId, centerId),
            eq(memberships.id, membershipId)
          )
        );

      // Close the current pause period
      await tx
        .update(membershipPausePeriods)
        .set({ endDate: new Date().toISOString().split('T')[0] })
        .where(
          and(
            eq(membershipPausePeriods.centerId, centerId),
            eq(membershipPausePeriods.membershipId, membershipId),
            isNull(membershipPausePeriods.endDate)
          )
        );
    });
  },

  /**
   * Use a session from a session-based membership
   */
  async useSession(centerId: string, membershipId: string) {
    return await db
      .update(memberships)
      .set({ 
        sessionsUsed: sql`${memberships.sessionsUsed} + 1`,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(memberships.centerId, centerId),
          eq(memberships.id, membershipId),
          sql`${memberships.sessionsUsed} < ${memberships.sessionsTotal}`
        )
      )
      .returning();
  },
};

/**
 * CLASS MANAGEMENT QUERIES
 */

export const classQueries = {
  /**
   * Create a new class
   */
  async createClass(centerId: string, data: {
    instructorId?: string;
    name: string;
    description?: string;
    classType?: string;
    maxCapacity: number;
    durationMinutes: number;
    pricePerSession?: string;
  }) {
    return await db.insert(classes).values({
      centerId,
      ...data,
    }).returning();
  },

  /**
   * Create a class session
   */
  async createClassSession(centerId: string, data: {
    classId: string;
    instructorId?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
  }) {
    return await db.insert(classSessions).values({
      centerId,
      ...data,
    }).returning();
  },

  /**
   * Get upcoming class sessions with booking counts
   */
  async getUpcomingClassSessions(centerId: string, days = 7) {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    return await db
      .select({
        session: classSessions,
        class: classes,
        instructor: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },
        bookingCount: count(classBookings.id),
      })
      .from(classSessions)
      .innerJoin(classes, eq(classSessions.classId, classes.id))
      .leftJoin(users, eq(classSessions.instructorId, users.id))
      .leftJoin(classBookings, 
        and(
          eq(classBookings.classSessionId, classSessions.id),
          eq(classBookings.bookingStatus, "booked")
        )
      )
      .where(
        and(
          eq(classSessions.centerId, centerId),
          gte(classSessions.scheduledDate, today),
          lte(classSessions.scheduledDate, futureDateStr)
        )
      )
      .groupBy(classSessions.id, classes.id, users.id)
      .orderBy(asc(classSessions.scheduledDate), asc(classSessions.startTime));
  },

  /**
   * Book a class for a member
   */
  async bookClass(centerId: string, data: {
    classSessionId: string;
    memberId: string;
    membershipId?: string;
  }) {
    return await db.transaction(async (tx) => {
      // Check if class is at capacity
      const [session] = await tx
        .select()
        .from(classSessions)
        .where(
          and(
            eq(classSessions.centerId, centerId),
            eq(classSessions.id, data.classSessionId)
          )
        );

      if (!session) {
        throw new Error("Class session not found");
      }

      if (session.currentBookings >= session.maxCapacity) {
        throw new Error("Class is at full capacity");
      }

      // Create booking
      const booking = await tx.insert(classBookings).values({
        centerId,
        classSessionId: data.classSessionId,
        memberId: data.memberId,
        membershipId: data.membershipId,
      }).returning();

      // Update current bookings count
      await tx
        .update(classSessions)
        .set({ 
          currentBookings: sql`${classSessions.currentBookings} + 1`,
          updatedAt: new Date()
        })
        .where(eq(classSessions.id, data.classSessionId));

      // If using a session-based membership, deduct a session
      if (data.membershipId) {
        await membershipQueries.useSession(centerId, data.membershipId);
      }

      return booking;
    });
  },

  /**
   * Cancel a class booking
   */
  async cancelBooking(centerId: string, bookingId: string) {
    return await db.transaction(async (tx) => {
      // Update booking status
      const [booking] = await tx
        .update(classBookings)
        .set({ 
          bookingStatus: "cancelled",
          cancelledAt: new Date(),
          updatedAt: new Date()
        })
        .where(
          and(
            eq(classBookings.centerId, centerId),
            eq(classBookings.id, bookingId)
          )
        )
        .returning();

      if (!booking) {
        throw new Error("Booking not found");
      }

      // Update current bookings count
      await tx
        .update(classSessions)
        .set({ 
          currentBookings: sql`${classSessions.currentBookings} - 1`,
          updatedAt: new Date()
        })
        .where(eq(classSessions.id, booking.classSessionId));

      return booking;
    });
  },

  /**
   * Mark attendance for a class
   */
  async markAttendance(centerId: string, bookingId: string) {
    return await db
      .update(classBookings)
      .set({ 
        bookingStatus: "attended",
        attendedAt: new Date(),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(classBookings.centerId, centerId),
          eq(classBookings.id, bookingId)
        )
      )
      .returning();
  },
};

/**
 * PAYMENT QUERIES
 */

export const paymentQueries = {
  /**
   * Record a payment
   */
  async createPayment(centerId: string, data: {
    memberId: string;
    membershipId?: string;
    amount: string;
    paymentMethod: "card" | "bank_transfer" | "cash" | "other";
    stripePaymentIntentId?: string;
    description?: string;
  }) {
    return await db.insert(payments).values({
      centerId,
      ...data,
      status: "completed",
      paymentDate: new Date(),
    }).returning();
  },

  /**
   * Get payment history for a center
   */
  async getPaymentHistory(centerId: string, page = 1, limit = 50) {
    const offset = (page - 1) * limit;

    return await db
      .select({
        payment: payments,
        member: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        membership: memberships,
        membershipType: membershipTypes,
      })
      .from(payments)
      .innerJoin(users, eq(payments.memberId, users.id))
      .leftJoin(memberships, eq(payments.membershipId, memberships.id))
      .leftJoin(membershipTypes, eq(memberships.membershipTypeId, membershipTypes.id))
      .where(eq(payments.centerId, centerId))
      .orderBy(desc(payments.paymentDate))
      .limit(limit)
      .offset(offset);
  },

  /**
   * Get monthly revenue
   */
  async getMonthlyRevenue(centerId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [result] = await db
      .select({
        totalRevenue: sum(payments.amount),
        totalTransactions: count(payments.id),
      })
      .from(payments)
      .where(
        and(
          eq(payments.centerId, centerId),
          eq(payments.status, "completed"),
          gte(payments.paymentDate, startDate),
          lte(payments.paymentDate, endDate)
        )
      );

    return {
      totalRevenue: result.totalRevenue || "0",
      totalTransactions: result.totalTransactions,
      month,
      year,
    };
  },
};

/**
 * SUBSCRIPTION QUERIES (SaaS billing)
 */

export const subscriptionQueries = {
  /**
   * Create or update center subscription
   */
  async upsertSubscription(centerId: string, data: {
    planType: "free" | "premium";
    stripeSubscriptionId?: string;
    status: "active" | "past_due" | "cancelled" | "trialing";
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    memberCount: number;
    amount?: string;
  }) {
    return await db.insert(subscriptions).values({
      centerId,
      ...data,
    }).onConflictDoUpdate({
      target: subscriptions.centerId,
      set: data,
    }).returning();
  },

  /**
   * Get center subscription
   */
  async getSubscription(centerId: string) {
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.centerId, centerId))
      .limit(1);

    return subscription[0] || null;
  },

  /**
   * Update member count for billing calculation
   */
  async updateMemberCount(centerId: string) {
    const [memberCount] = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.centerId, centerId),
          eq(users.role, "member"),
          eq(users.isActive, true)
        )
      );

    return await db
      .update(subscriptions)
      .set({ 
        memberCount: memberCount.count,
        updatedAt: new Date()
      })
      .where(eq(subscriptions.centerId, centerId))
      .returning();
  },
};

/**
 * ANALYTICS QUERIES
 */

export const analyticsQueries = {
  /**
   * Get dashboard overview
   */
  async getDashboardOverview(centerId: string) {
    const stats = await centerQueries.getCenterStats(centerId);
    const subscription = await subscriptionQueries.getSubscription(centerId);
    
    // Get recent activities (payments, bookings)
    const recentPayments = await db
      .select({
        id: payments.id,
        amount: payments.amount,
        paymentDate: payments.paymentDate,
        memberName: sql`${users.firstName} || ' ' || ${users.lastName}`,
      })
      .from(payments)
      .innerJoin(users, eq(payments.memberId, users.id))
      .where(eq(payments.centerId, centerId))
      .orderBy(desc(payments.paymentDate))
      .limit(5);

    const upcomingClasses = await classQueries.getUpcomingClassSessions(centerId, 3);

    return {
      stats,
      subscription,
      recentPayments,
      upcomingClasses: upcomingClasses.slice(0, 5),
    };
  },

  /**
   * Get membership type performance
   */
  async getMembershipTypeStats(centerId: string) {
    return await db
      .select({
        membershipType: membershipTypes,
        activeMemberships: count(memberships.id),
        totalRevenue: sum(payments.amount),
      })
      .from(membershipTypes)
      .leftJoin(memberships, 
        and(
          eq(memberships.membershipTypeId, membershipTypes.id),
          eq(memberships.status, "active")
        )
      )
      .leftJoin(payments, eq(payments.membershipId, memberships.id))
      .where(eq(membershipTypes.centerId, centerId))
      .groupBy(membershipTypes.id);
  },
};

/**
 * UTILITY FUNCTIONS
 */

export const utils = {
  /**
   * Create tenant context for queries
   */
  createTenantContext(centerId: string): TenantContext {
    return new TenantContext(centerId);
  },

  /**
   * Validate center access by Clerk org ID
   */
  async validateCenterAccess(clerkOrgId: string): Promise<string | null> {
    const center = await centerQueries.getCenterByClerkOrgId(clerkOrgId);
    return center?.id || null;
  },
};