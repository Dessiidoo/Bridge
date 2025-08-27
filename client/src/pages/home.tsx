import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Globe, Target, Users, TrendingUp, Languages, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const features = [
    {
      icon: Target,
      title: "Precision Matching",
      description: "AI analyzes your profile to find jobs with the highest success probability across all countries."
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "From farming in Canada to tech roles in Germany - discover jobs in every industry worldwide."
    },
    {
      icon: TrendingUp,
      title: "Step-by-Step Guidance",
      description: "Get detailed action plans with costs, timelines, and requirements to secure each position."
    },
    {
      icon: Languages,
      title: "Multilingual Support",
      description: "Platform available in multiple languages to help you navigate international opportunities."
    }
  ];

  const stats = [
    { number: "50K+", label: "Global Job Opportunities" },
    { number: "180", label: "Countries Covered" },
    { number: "92%", label: "Average Match Accuracy" },
    { number: "15K+", label: "Successful Placements" }
  ];

  const jobExamples = [
    { title: "Farm Worker", location: "Canada", salary: "$35-45K CAD", visa: true },
    { title: "Hotel Receptionist", location: "Netherlands", salary: "€28-35K", visa: false },
    { title: "Software Developer", location: "Germany", salary: "€65-85K", visa: true },
    { title: "Construction Worker", location: "Australia", salary: "$55-70K AUD", visa: true },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Bridge Your Way to
            <span className="text-blue-600 block mt-2">Global Opportunities</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            The world's first AI-powered platform that matches you with legitimate job opportunities 
            across all countries and industries. From agriculture to technology, from entry-level to executive - 
            find your perfect international career path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/profile" data-testid="button-start-matching">
              <Button size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700">
                Start Job Matching <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/jobs" data-testid="button-browse-jobs">
              <Button variant="outline" size="lg" className="text-lg px-8 border-blue-600 text-blue-600 hover:bg-blue-50">
                Browse Global Jobs
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Jobs, Real Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every type of work, in every country. Our AI finds opportunities others miss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {jobExamples.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`job-example-${index}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-green-600 mb-2">{job.salary}</div>
                  {job.visa && (
                    <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Visa Sponsored
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/jobs" data-testid="link-view-all-jobs">
              <Button size="lg" variant="outline">
                View All Global Opportunities <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Bridge Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI technology analyzes millions of data points to calculate your exact chances 
              of success for each job opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow p-6" data-testid={`feature-${index}`}>
                <CardHeader>
                  <feature.icon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Path to Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to discover your next career opportunity anywhere in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center" data-testid="step-1">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Complete Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your skills, experience, and career goals. The more details, the better our matches.
              </p>
            </div>

            <div className="text-center" data-testid="step-2">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Get AI-Powered Matches</h3>
              <p className="text-gray-600">
                Our AI analyzes thousands of jobs and calculates your success probability for each opportunity.
              </p>
            </div>

            <div className="text-center" data-testid="step-3">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Follow the Action Plan</h3>
              <p className="text-gray-600">
                Receive detailed, step-by-step guidance with timelines and costs to secure your dream job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Bridge Your Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who have found their perfect international career match. 
            Your next opportunity is waiting.
          </p>
          <Link href="/profile" data-testid="button-get-started-cta">
            <Button size="lg" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100">
              Get Started Now <Users className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}