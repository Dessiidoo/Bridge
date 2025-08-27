import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User Profile API routes
  app.get("/api/user-profile/:id", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user profile: " + error.message });
    }
  });

  app.post("/api/user-profile", async (req, res) => {
    try {
      const profile = await storage.createUserProfile(req.body);
      res.status(201).json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating user profile: " + error.message });
    }
  });

  app.put("/api/user-profile/:id", async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.id, req.body);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating user profile: " + error.message });
    }
  });

  // Job Opportunities API routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const { country, industry, active, search } = req.query;
      
      let jobs;
      if (search) {
        jobs = await storage.searchJobOpportunities(search as string);
      } else {
        jobs = await storage.getJobOpportunities({
          country: country as string,
          industry: industry as string,
          active: active ? active === 'true' : undefined
        });
      }
      
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching jobs: " + error.message });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobOpportunity(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching job: " + error.message });
    }
  });

  // AI Job Matching API
  app.post("/api/match-jobs", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userProfile = await storage.getUserProfile(userId);
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Get available jobs
      const jobs = await storage.getJobOpportunities({ active: true });
      
      // Use AI to analyze matches
      const matches = [];
      
      for (const job of jobs.slice(0, 5)) { // Limit to 5 jobs for demo
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-5",
            messages: [
              {
                role: "system",
                content: "You are an AI job matching expert. Analyze how well a user profile matches a job opportunity. Consider skills, experience, education, location preferences, salary expectations, and visa requirements. Respond with JSON in this format: { 'matchScore': number (0-100), 'analysis': string, 'difficulty': 'easy'|'medium'|'hard', 'successProbability': number (0-100), 'requiredSteps': [{'step': number, 'title': string, 'description': string, 'estimatedTime': string, 'cost': number}] }"
              },
              {
                role: "user",
                content: `User Profile: ${JSON.stringify({
                  skills: userProfile.skills,
                  experience: userProfile.workExperience,
                  education: userProfile.education,
                  languages: userProfile.languages,
                  location: userProfile.currentLocation,
                  preferredCountries: userProfile.preferredCountries,
                  salaryExpectation: userProfile.salaryExpectation,
                  willingToRelocate: userProfile.willingToRelocate,
                  hasPassport: userProfile.hasPassport
                })}
                
                Job Opportunity: ${JSON.stringify({
                  title: job.title,
                  company: job.company,
                  country: job.country,
                  industry: job.industry,
                  requirements: job.requirements,
                  salary: job.salary,
                  languagesRequired: job.languagesRequired,
                  visaSponsorship: job.visaSponsorship,
                  experienceRequired: job.experienceRequired,
                  educationRequired: job.educationRequired
                })}`
              }
            ],
            response_format: { type: "json_object" },
          });

          const aiResult = JSON.parse(response.choices[0].message.content || "{}");
          
          // Create job match record
          const jobMatch = await storage.createJobMatch({
            userId: userId,
            jobId: job.id,
            matchScore: Math.max(0, Math.min(100, Math.round(aiResult.matchScore || 0))),
            matchAnalysis: aiResult.analysis || "AI analysis not available",
            requiredSteps: aiResult.requiredSteps || [],
            overallDifficulty: aiResult.difficulty || "medium",
            successProbability: Math.max(0, Math.min(100, Math.round(aiResult.successProbability || 50)))
          });

          matches.push({
            ...jobMatch,
            job: job
          });
        } catch (aiError) {
          console.error("AI analysis error for job", job.id, aiError);
          // Fallback match without AI
          const fallbackMatch = await storage.createJobMatch({
            userId: userId,
            jobId: job.id,
            matchScore: 50,
            matchAnalysis: "Basic compatibility analysis: This job requires review of your qualifications.",
            requiredSteps: [
              {
                step: 1,
                title: "Review Requirements",
                description: "Carefully review the job requirements and compare with your skills",
                estimatedTime: "30 minutes",
                cost: 0
              }
            ],
            overallDifficulty: "medium",
            successProbability: 50
          });

          matches.push({
            ...fallbackMatch,
            job: job
          });
        }
      }

      // Sort by match score
      matches.sort((a, b) => b.matchScore - a.matchScore);
      
      res.json({ matches });
    } catch (error: any) {
      console.error("Job matching error:", error);
      res.status(500).json({ message: "Error matching jobs: " + error.message });
    }
  });

  // Get user's job matches
  app.get("/api/matches/:userId", async (req, res) => {
    try {
      const matches = await storage.getJobMatches(req.params.userId);
      
      // Enhance matches with job details
      const enhancedMatches = await Promise.all(
        matches.map(async (match) => {
          const job = await storage.getJobOpportunity(match.jobId);
          return { ...match, job };
        })
      );
      
      res.json(enhancedMatches);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching matches: " + error.message });
    }
  });

  // Chat API endpoint for AI assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are Bridge, an AI-powered international job placement assistant. You help people find job opportunities around the world and guide them through the process of securing employment in different countries.

Your expertise includes:
- Job matching based on skills, experience, and preferences
- Visa and work permit requirements for different countries
- Application strategies and resume optimization
- Interview preparation and cultural adaptation
- Salary expectations and cost of living comparisons
- Language requirements and learning resources

Always provide practical, actionable advice. Be encouraging but realistic about challenges. Focus on legitimate opportunities and legal pathways to international employment.

${context ? `Additional context: ${JSON.stringify(context)}` : ''}`
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      const aiResponse = response.choices[0].message.content;
      
      res.json({
        message: aiResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Error processing chat: " + error.message });
    }
  });

  // Service pricing API
  app.get("/api/pricing", async (req, res) => {
    try {
      const pricingTiers = [
        {
          id: "basic",
          name: "Basic Match",
          price: 2900, // $29 in cents
          currency: "usd",
          features: [
            "AI job matching analysis",
            "Top 5 job recommendations",
            "Basic success probability assessment",
            "General application guidance"
          ],
          description: "Perfect for exploring your options"
        },
        {
          id: "detailed",
          name: "Detailed Analysis",
          price: 7900, // $79 in cents
          currency: "usd",
          features: [
            "Comprehensive AI job matching",
            "Top 15 job recommendations",
            "Detailed step-by-step action plans",
            "Country-specific visa guidance",
            "Resume optimization suggestions",
            "Interview preparation tips"
          ],
          description: "Complete analysis and actionable guidance"
        },
        {
          id: "premium",
          name: "Premium Support",
          price: 19900, // $199 in cents
          currency: "usd",
          features: [
            "Everything in Detailed Analysis",
            "Unlimited job matching updates",
            "Priority customer support",
            "Custom application templates",
            "Salary negotiation strategies",
            "30-day application tracking"
          ],
          description: "Full-service job placement support"
        }
      ];
      
      res.json(pricingTiers);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching pricing: " + error.message });
    }
  });

  // Analytics endpoint for global job statistics
  app.get("/api/analytics/job-stats", async (req, res) => {
    try {
      const jobs = await storage.getJobOpportunities({ active: true });
      
      // Calculate statistics
      const totalJobs = jobs.length;
      const countryCounts = jobs.reduce((acc: Record<string, number>, job) => {
        acc[job.country] = (acc[job.country] || 0) + 1;
        return acc;
      }, {});
      
      const industryCounts = jobs.reduce((acc: Record<string, number>, job) => {
        acc[job.industry] = (acc[job.industry] || 0) + 1;
        return acc;
      }, {});
      
      const visaSponsorshipJobs = jobs.filter(job => job.visaSponsorship).length;
      
      res.json({
        totalJobs,
        visaSponsorshipJobs,
        visaSponsorshipPercentage: Math.round((visaSponsorshipJobs / totalJobs) * 100),
        topCountries: Object.entries(countryCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([country, count]) => ({ country, count })),
        topIndustries: Object.entries(industryCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([industry, count]) => ({ industry, count })),
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analytics: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}