import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles for job seekers
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  nationality: text("nationality").notNull(),
  currentLocation: text("current_location").notNull(),
  languages: text("languages").array().notNull(),
  education: text("education").notNull(), // 'none', 'primary', 'secondary', 'vocational', 'bachelor', 'master', 'phd'
  workExperience: jsonb("work_experience").notNull(),
  skills: text("skills").array().notNull(),
  preferredCountries: text("preferred_countries").array().notNull(),
  preferredIndustries: text("preferred_industries").array().notNull(),
  salaryExpectation: jsonb("salary_expectation").notNull(),
  willingToRelocate: boolean("willing_to_relocate").default(true),
  hasPassport: boolean("has_passport").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job opportunities from around the world
export const jobOpportunities = pgTable("job_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  industry: text("industry").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array().notNull(),
  salary: jsonb("salary").notNull(),
  languagesRequired: text("languages_required").array().notNull(),
  visaSponsorship: boolean("visa_sponsorship").default(false),
  experienceRequired: integer("experience_required").default(0),
  educationRequired: text("education_required").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI-generated job matches with detailed analysis
export const jobMatches = pgTable("job_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userProfiles.id),
  jobId: varchar("job_id").notNull().references(() => jobOpportunities.id),
  matchScore: integer("match_score").notNull(), // 0-100
  matchAnalysis: text("match_analysis").notNull(),
  requiredSteps: jsonb("required_steps").notNull(),
  overallDifficulty: text("overall_difficulty").notNull(), // 'easy', 'medium', 'hard'
  successProbability: integer("success_probability").notNull(), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

// Service pricing for different tiers
export const servicePricing = pgTable("service_pricing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => userProfiles.id),
  serviceType: text("service_type").notNull(), // 'basic_match', 'detailed_analysis', 'full_guidance', 'premium_support'
  price: integer("price").notNull(), // in cents
  currency: text("currency").default("usd"),
  features: text("features").array().notNull(),
  isActive: boolean("is_active").default(true),
  stripePaymentId: text("stripe_payment_id"),
  status: text("status").default("pending"), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertJobOpportunitySchema = createInsertSchema(jobOpportunities).omit({
  id: true,
  createdAt: true,
});

export const insertJobMatchSchema = createInsertSchema(jobMatches).omit({
  id: true,
  createdAt: true,
});

export const insertServicePricingSchema = createInsertSchema(servicePricing).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type UserProfile = typeof userProfiles.$inferSelect;
export type JobOpportunity = typeof jobOpportunities.$inferSelect;
export type JobMatch = typeof jobMatches.$inferSelect;
export type ServicePricing = typeof servicePricing.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertJobOpportunity = z.infer<typeof insertJobOpportunitySchema>;
export type InsertJobMatch = z.infer<typeof insertJobMatchSchema>;
export type InsertServicePricing = z.infer<typeof insertServicePricingSchema>;