import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  date,
  time,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["center_admin", "staff", "member"]);
export const centerStatusEnum = pgEnum("center_status", ["active", "suspended", "trial"]);
export const membershipTypeEnum = pgEnum("membership_type", ["unlimited_time", "limited_sessions", "day_pass"]);
export const membershipStatusEnum = pgEnum("membership_status", ["active", "paused", "expired", "cancelled"]);
export const classStatusEnum = pgEnum("class_status", ["scheduled", "in_progress", "completed", "cancelled"]);
export const bookingStatusEnum = pgEnum("booking_status", ["booked", "attended", "no_show", "cancelled"]);
export const paymentMethodEnum = pgEnum("payment_method", ["card", "bank_transfer", "cash", "other"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["free", "premium"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "past_due", "cancelled", "trialing"]);
export const announcementPriorityEnum = pgEnum("announcement_priority", ["low", "normal", "high", "urgent"]);
export const announcementTargetEnum = pgEnum("announcement_target", ["all", "members", "staff"]);

// Core Tables

/**
 * Centers - Tenant root entity for multi-tenant architecture
 * Each center is a separate gym/fitness facility
 */
export const centers = pgTable("centers", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrgId: varchar("clerk_org_id", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  businessRegistrationNumber: varchar("business_registration_number", { length: 50 }),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  websiteUrl: varchar("website_url", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 500 }),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  operatingHours: jsonb("operating_hours"), // { monday: { open: "06:00", close: "22:00" }, ... }
  description: text("description"),
  vatNumber: varchar("vat_number", { length: 50 }),
  bankAccount: varchar("bank_account", { length: 100 }),
  status: centerStatusEnum("status").default("trial").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Users - Multi-role users (admins, staff, members) with tenant isolation
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  birthDate: date("birth_date"),
  emergencyContactName: varchar("emergency_contact_name", { length: 100 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
  medicalConditions: text("medical_conditions"),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Membership Types - Templates for creating memberships
 */
export const membershipTypes = pgTable("membership_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: membershipTypeEnum("type").notNull(),
  durationDays: integer("duration_days"), // null for session-based
  sessionCount: integer("session_count"), // null for time-based
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("KRW").notNull(),
  description: text("description"),
  termsAndConditions: text("terms_and_conditions"),
  allowsPause: boolean("allows_pause").default(false).notNull(),
  maxPauseDays: integer("max_pause_days"),
  pauseCostPerDay: decimal("pause_cost_per_day", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Memberships - Active member subscriptions
 */
export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  memberId: uuid("member_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  membershipTypeId: uuid("membership_type_id").references(() => membershipTypes.id, { onDelete: "restrict" }).notNull(),
  status: membershipStatusEnum("status").default("active").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // null for session-based
  sessionsTotal: integer("sessions_total"), // null for time-based
  sessionsUsed: integer("sessions_used").default(0),
  totalPausedDays: integer("total_paused_days").default(0),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Membership Pause Periods - Detailed tracking of membership pauses
 */
export const membershipPausePeriods = pgTable("membership_pause_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  membershipId: uuid("membership_id").references(() => memberships.id, { onDelete: "cascade" }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // null if currently paused
  reason: varchar("reason", { length: 255 }),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "restrict" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Classes - Fitness class templates
 */
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  instructorId: uuid("instructor_id").references(() => users.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  classType: varchar("class_type", { length: 100 }),
  maxCapacity: integer("max_capacity").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  pricePerSession: decimal("price_per_session", { precision: 10, scale: 2 }),
  recurringSchedule: jsonb("recurring_schedule"), // cron-like or structured schedule
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Class Sessions - Specific instances of classes
 */
export const classSessions = pgTable("class_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  classId: uuid("class_id").references(() => classes.id, { onDelete: "cascade" }).notNull(),
  instructorId: uuid("instructor_id").references(() => users.id, { onDelete: "restrict" }),
  scheduledDate: date("scheduled_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  currentBookings: integer("current_bookings").default(0).notNull(),
  status: classStatusEnum("status").default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Class Bookings - Member reservations for class sessions
 */
export const classBookings = pgTable("class_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  classSessionId: uuid("class_session_id").references(() => classSessions.id, { onDelete: "cascade" }).notNull(),
  memberId: uuid("member_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  membershipId: uuid("membership_id").references(() => memberships.id, { onDelete: "restrict" }),
  bookingStatus: bookingStatusEnum("booking_status").default("booked").notNull(),
  bookedAt: timestamp("booked_at").defaultNow().notNull(),
  cancelledAt: timestamp("cancelled_at"),
  attendedAt: timestamp("attended_at"),
  waitlistPosition: integer("waitlist_position"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Payments - Member payments for memberships and services
 */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  memberId: uuid("member_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  membershipId: uuid("membership_id").references(() => memberships.id, { onDelete: "restrict" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("KRW").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Subscriptions - Center subscriptions to the SaaS platform
 */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  planType: subscriptionPlanEnum("plan_type").notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  status: subscriptionStatusEnum("status").default("trialing").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  memberCount: integer("member_count").default(0).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("KRW").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Announcements - Center notifications and announcements
 */
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  centerId: uuid("center_id").references(() => centers.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  priority: announcementPriorityEnum("priority").default("normal").notNull(),
  targetAudience: announcementTargetEnum("target_audience").default("all").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const centersRelations = relations(centers, ({ many }) => ({
  users: many(users),
  membershipTypes: many(membershipTypes),
  memberships: many(memberships),
  classes: many(classes),
  classSessions: many(classSessions),
  payments: many(payments),
  subscriptions: many(subscriptions),
  announcements: many(announcements),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  center: one(centers, {
    fields: [users.centerId],
    references: [centers.id],
  }),
  memberships: many(memberships),
  instructedClasses: many(classes),
  instructedSessions: many(classSessions),
  classBookings: many(classBookings),
  payments: many(payments),
  announcements: many(announcements),
}));

export const membershipTypesRelations = relations(membershipTypes, ({ one, many }) => ({
  center: one(centers, {
    fields: [membershipTypes.centerId],
    references: [centers.id],
  }),
  memberships: many(memberships),
}));

export const membershipsRelations = relations(memberships, ({ one, many }) => ({
  center: one(centers, {
    fields: [memberships.centerId],
    references: [centers.id],
  }),
  member: one(users, {
    fields: [memberships.memberId],
    references: [users.id],
  }),
  membershipType: one(membershipTypes, {
    fields: [memberships.membershipTypeId],
    references: [membershipTypes.id],
  }),
  pausePeriods: many(membershipPausePeriods),
  classBookings: many(classBookings),
  payments: many(payments),
}));

export const membershipPausePeriodsRelations = relations(membershipPausePeriods, ({ one }) => ({
  center: one(centers, {
    fields: [membershipPausePeriods.centerId],
    references: [centers.id],
  }),
  membership: one(memberships, {
    fields: [membershipPausePeriods.membershipId],
    references: [memberships.id],
  }),
  createdByUser: one(users, {
    fields: [membershipPausePeriods.createdBy],
    references: [users.id],
  }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  center: one(centers, {
    fields: [classes.centerId],
    references: [centers.id],
  }),
  instructor: one(users, {
    fields: [classes.instructorId],
    references: [users.id],
  }),
  classSessions: many(classSessions),
}));

export const classSessionsRelations = relations(classSessions, ({ one, many }) => ({
  center: one(centers, {
    fields: [classSessions.centerId],
    references: [centers.id],
  }),
  class: one(classes, {
    fields: [classSessions.classId],
    references: [classes.id],
  }),
  instructor: one(users, {
    fields: [classSessions.instructorId],
    references: [users.id],
  }),
  bookings: many(classBookings),
}));

export const classBookingsRelations = relations(classBookings, ({ one }) => ({
  center: one(centers, {
    fields: [classBookings.centerId],
    references: [centers.id],
  }),
  classSession: one(classSessions, {
    fields: [classBookings.classSessionId],
    references: [classSessions.id],
  }),
  member: one(users, {
    fields: [classBookings.memberId],
    references: [users.id],
  }),
  membership: one(memberships, {
    fields: [classBookings.membershipId],
    references: [memberships.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  center: one(centers, {
    fields: [payments.centerId],
    references: [centers.id],
  }),
  member: one(users, {
    fields: [payments.memberId],
    references: [users.id],
  }),
  membership: one(memberships, {
    fields: [payments.membershipId],
    references: [memberships.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  center: one(centers, {
    fields: [subscriptions.centerId],
    references: [centers.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  center: one(centers, {
    fields: [announcements.centerId],
    references: [centers.id],
  }),
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));

// TypeScript types
export type Center = typeof centers.$inferSelect;
export type NewCenter = typeof centers.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type MembershipType = typeof membershipTypes.$inferSelect;
export type NewMembershipType = typeof membershipTypes.$inferInsert;

export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;

export type MembershipPausePeriod = typeof membershipPausePeriods.$inferSelect;
export type NewMembershipPausePeriod = typeof membershipPausePeriods.$inferInsert;

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

export type ClassSession = typeof classSessions.$inferSelect;
export type NewClassSession = typeof classSessions.$inferInsert;

export type ClassBooking = typeof classBookings.$inferSelect;
export type NewClassBooking = typeof classBookings.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;