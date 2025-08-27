import { 
  type UserProfile, 
  type InsertUserProfile,
  type JobOpportunity,
  type InsertJobOpportunity,
  type JobMatch,
  type InsertJobMatch,
  type ServicePricing,
  type InsertServicePricing
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User profile methods
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  getUserProfileByEmail(email: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Job opportunity methods
  getJobOpportunities(filters?: { country?: string; industry?: string; active?: boolean }): Promise<JobOpportunity[]>;
  getJobOpportunity(id: string): Promise<JobOpportunity | undefined>;
  createJobOpportunity(job: InsertJobOpportunity): Promise<JobOpportunity>;
  updateJobOpportunity(id: string, updates: Partial<InsertJobOpportunity>): Promise<JobOpportunity | undefined>;
  searchJobOpportunities(query: string): Promise<JobOpportunity[]>;
  
  // Job match methods
  getJobMatches(userId: string): Promise<JobMatch[]>;
  createJobMatch(match: InsertJobMatch): Promise<JobMatch>;
  getJobMatch(id: string): Promise<JobMatch | undefined>;
  
  // Service pricing methods
  getServicePricing(userId: string): Promise<ServicePricing[]>;
  createServicePricing(pricing: InsertServicePricing): Promise<ServicePricing>;
  updateServicePricingStatus(id: string, status: string, stripePaymentId?: string): Promise<ServicePricing | undefined>;
}

export class MemStorage implements IStorage {
  private userProfiles: Map<string, UserProfile>;
  private jobOpportunities: Map<string, JobOpportunity>;
  private jobMatches: Map<string, JobMatch>;
  private servicePricing: Map<string, ServicePricing>;

  constructor() {
    this.userProfiles = new Map();
    this.jobOpportunities = new Map();
    this.jobMatches = new Map();
    this.servicePricing = new Map();
    
    // Add sample data for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user profile
    const sampleProfile: UserProfile = {
      id: "user-1",
      email: "demo@bridge.com",
      fullName: "Alex Johnson",
      age: 28,
      nationality: "American",
      currentLocation: "New York, USA",
      languages: ["English", "Spanish"],
      education: "bachelor",
      workExperience: [
        {
          title: "Software Developer",
          industry: "Technology",
          yearsOfExperience: 3,
          description: "Full-stack web development using React and Node.js"
        }
      ],
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      preferredCountries: ["Canada", "Germany", "Netherlands", "Australia"],
      preferredIndustries: ["Technology", "Software Development", "Startups"],
      salaryExpectation: {
        min: 70000,
        max: 100000,
        currency: "USD"
      },
      willingToRelocate: true,
      hasPassport: true,
      createdAt: new Date(),
    };
    this.userProfiles.set(sampleProfile.id, sampleProfile);

    // Create sample job opportunities from different countries
    const sampleJobs: JobOpportunity[] = [
      {
        id: "job-1",
        title: "Frontend Developer",
        company: "Tech Solutions GmbH",
        country: "Germany",
        city: "Berlin",
        industry: "Technology",
        description: "Join our dynamic team building innovative web applications. We offer visa sponsorship and relocation assistance.",
        requirements: ["React", "TypeScript", "3+ years experience", "English fluency"],
        salary: {
          min: 65000,
          max: 85000,
          currency: "EUR"
        },
        languagesRequired: ["English", "German (basic)"],
        visaSponsorship: true,
        experienceRequired: 3,
        educationRequired: "bachelor",
        isActive: true,
        createdAt: new Date("2024-08-15"),
      },
      {
        id: "job-2",
        title: "Farm Worker",
        company: "Green Valley Farms",
        country: "Canada",
        city: "Kelowna, BC",
        industry: "Agriculture",
        description: "Year-round position at organic farm with accommodation provided. Perfect for those seeking outdoor work and Canadian experience.",
        requirements: ["Physical fitness", "No experience required", "Willingness to learn"],
        salary: {
          min: 35000,
          max: 45000,
          currency: "CAD"
        },
        languagesRequired: ["English"],
        visaSponsorship: true,
        experienceRequired: 0,
        educationRequired: "none",
        isActive: true,
        createdAt: new Date("2024-08-10"),
      },
      {
        id: "job-3",
        title: "Hotel Receptionist",
        company: "Grand Hotel Amsterdam",
        country: "Netherlands",
        city: "Amsterdam",
        industry: "Hospitality",
        description: "Evening shift receptionist for luxury hotel. Great opportunity to gain European work experience.",
        requirements: ["Customer service", "Multiple languages", "Professional appearance"],
        salary: {
          min: 28000,
          max: 35000,
          currency: "EUR"
        },
        languagesRequired: ["English", "Dutch"],
        visaSponsorship: false,
        experienceRequired: 1,
        educationRequired: "secondary",
        isActive: true,
        createdAt: new Date("2024-08-05"),
      },
      {
        id: "job-4",
        title: "Construction Worker",
        company: "Sydney Build Co",
        country: "Australia",
        city: "Sydney",
        industry: "Construction",
        description: "Skilled construction work with competitive pay. Sponsorship available for right candidate.",
        requirements: ["Construction experience", "Safety certification", "Physical fitness"],
        salary: {
          min: 55000,
          max: 70000,
          currency: "AUD"
        },
        languagesRequired: ["English"],
        visaSponsorship: true,
        experienceRequired: 2,
        educationRequired: "vocational",
        isActive: true,
        createdAt: new Date("2024-07-30"),
      }
    ];

    sampleJobs.forEach(job => {
      this.jobOpportunities.set(job.id, job);
    });

    // Create sample job match
    const sampleMatch: JobMatch = {
      id: "match-1",
      userId: sampleProfile.id,
      jobId: "job-1",
      matchScore: 92,
      matchAnalysis: "Excellent match! Your React and JavaScript skills align perfectly with this role. The salary matches your expectations, and the company offers visa sponsorship.",
      requiredSteps: [
        {
          step: 1,
          title: "Improve German Language Skills",
          description: "Take basic German lessons to meet language requirements",
          estimatedTime: "2-3 months",
          cost: 500
        },
        {
          step: 2,
          title: "Update Resume for German Market",
          description: "Format resume according to German standards (Lebenslauf)",
          estimatedTime: "1 week",
          cost: 0
        },
        {
          step: 3,
          title: "Apply for Work Visa",
          description: "Submit visa application with job offer",
          estimatedTime: "4-6 weeks",
          cost: 200
        }
      ],
      overallDifficulty: "medium",
      successProbability: 85,
      createdAt: new Date(),
    };
    this.jobMatches.set(sampleMatch.id, sampleMatch);
  }

  // User profile methods
  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.email === email,
    );
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { 
      ...insertProfile, 
      id, 
      createdAt: new Date(),
      willingToRelocate: insertProfile.willingToRelocate ?? true,
      hasPassport: insertProfile.hasPassport ?? false
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const profile = this.userProfiles.get(id);
    if (!profile) return undefined;

    const updatedProfile = { ...profile, ...updates };
    this.userProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  // Job opportunity methods
  async getJobOpportunities(filters?: { country?: string; industry?: string; active?: boolean }): Promise<JobOpportunity[]> {
    let jobs = Array.from(this.jobOpportunities.values());
    
    if (filters) {
      if (filters.country) {
        jobs = jobs.filter(job => job.country.toLowerCase().includes(filters.country!.toLowerCase()));
      }
      if (filters.industry) {
        jobs = jobs.filter(job => job.industry.toLowerCase().includes(filters.industry!.toLowerCase()));
      }
      if (filters.active !== undefined) {
        jobs = jobs.filter(job => job.isActive === filters.active);
      }
    }
    
    return jobs.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getJobOpportunity(id: string): Promise<JobOpportunity | undefined> {
    return this.jobOpportunities.get(id);
  }

  async createJobOpportunity(jobData: InsertJobOpportunity): Promise<JobOpportunity> {
    const id = randomUUID();
    const job: JobOpportunity = {
      ...jobData,
      id,
      createdAt: new Date(),
      visaSponsorship: jobData.visaSponsorship ?? false,
      experienceRequired: jobData.experienceRequired ?? 0,
      isActive: jobData.isActive ?? true
    };
    this.jobOpportunities.set(id, job);
    return job;
  }

  async updateJobOpportunity(id: string, updates: Partial<InsertJobOpportunity>): Promise<JobOpportunity | undefined> {
    const job = this.jobOpportunities.get(id);
    if (!job) return undefined;

    const updatedJob = { ...job, ...updates };
    this.jobOpportunities.set(id, updatedJob);
    return updatedJob;
  }

  async searchJobOpportunities(query: string): Promise<JobOpportunity[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.jobOpportunities.values()).filter(job => 
      job.title.toLowerCase().includes(lowerQuery) ||
      job.company.toLowerCase().includes(lowerQuery) ||
      job.industry.toLowerCase().includes(lowerQuery) ||
      job.country.toLowerCase().includes(lowerQuery) ||
      job.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Job match methods
  async getJobMatches(userId: string): Promise<JobMatch[]> {
    return Array.from(this.jobMatches.values())
      .filter(match => match.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createJobMatch(matchData: InsertJobMatch): Promise<JobMatch> {
    const id = randomUUID();
    const match: JobMatch = {
      ...matchData,
      id,
      createdAt: new Date(),
    };
    this.jobMatches.set(id, match);
    return match;
  }

  async getJobMatch(id: string): Promise<JobMatch | undefined> {
    return this.jobMatches.get(id);
  }

  // Service pricing methods
  async getServicePricing(userId: string): Promise<ServicePricing[]> {
    return Array.from(this.servicePricing.values())
      .filter(pricing => pricing.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createServicePricing(pricingData: InsertServicePricing): Promise<ServicePricing> {
    const id = randomUUID();
    const pricing: ServicePricing = {
      ...pricingData,
      id,
      createdAt: new Date(),
      isActive: pricingData.isActive ?? true,
      currency: pricingData.currency ?? "usd",
      status: pricingData.status ?? "pending",
      stripePaymentId: pricingData.stripePaymentId ?? null
    };
    this.servicePricing.set(id, pricing);
    return pricing;
  }

  async updateServicePricingStatus(id: string, status: string, stripePaymentId?: string): Promise<ServicePricing | undefined> {
    const pricing = this.servicePricing.get(id);
    if (!pricing) return undefined;

    const updatedPricing = {
      ...pricing,
      status,
      ...(stripePaymentId && { stripePaymentId }),
    };
    this.servicePricing.set(id, updatedPricing);
    return updatedPricing;
  }
}

export const storage = new MemStorage();