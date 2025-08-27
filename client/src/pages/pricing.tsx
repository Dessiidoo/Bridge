import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Target, Users, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const { data: pricingTiers = [], isLoading } = useQuery({
    queryKey: ['/api/pricing'],
    queryFn: () => apiRequest('GET', '/api/pricing').then(res => res.json())
  });

  const formatPrice = (priceInCents: number, currency: string) => {
    const price = priceInCents / 100;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return formatter.format(price);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return Target;
      case 'detailed': return Star;
      case 'premium': return Zap;
      default: return Users;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic': return 'border-blue-200 hover:border-blue-300';
      case 'detailed': return 'border-purple-200 hover:border-purple-300 bg-gradient-to-b from-purple-50 to-white';
      case 'premium': return 'border-yellow-200 hover:border-yellow-300 bg-gradient-to-b from-yellow-50 to-white';
      default: return 'border-gray-200 hover:border-gray-300';
    }
  };

  const isPopular = (planId: string) => planId === 'detailed';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan to accelerate your international career journey. 
            Every plan includes our AI-powered job matching technology.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid="button-monthly-billing"
            >
              One-time
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              data-testid="button-annual-billing"
            >
              Subscription
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier: any) => {
            const IconComponent = getPlanIcon(tier.id);
            const popular = isPopular(tier.id);
            
            return (
              <Card 
                key={tier.id} 
                className={`relative hover:shadow-xl transition-all duration-300 ${getPlanColor(tier.id)} ${popular ? 'scale-105' : ''}`}
                data-testid={`pricing-card-${tier.id}`}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      tier.id === 'basic' ? 'bg-blue-100' :
                      tier.id === 'detailed' ? 'bg-purple-100' : 'bg-yellow-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        tier.id === 'basic' ? 'text-blue-600' :
                        tier.id === 'detailed' ? 'text-purple-600' : 'text-yellow-600'
                      }`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold mb-2">
                    {formatPrice(tier.price, tier.currency)}
                  </div>
                  <CardDescription className="text-gray-600">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      tier.id === 'basic' ? 'bg-blue-600 hover:bg-blue-700' :
                      tier.id === 'detailed' ? 'bg-purple-600 hover:bg-purple-700' : 
                      'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                    size="lg"
                    data-testid={`button-select-${tier.id}`}
                  >
                    {tier.id === 'basic' ? 'Get Started' :
                     tier.id === 'detailed' ? 'Start Analysis' : 'Go Premium'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">What's Included</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">AI Job Matching</h3>
              <p className="text-gray-600 text-sm">
                Our advanced AI analyzes your profile against thousands of global opportunities, 
                calculating exact success probabilities for each match.
              </p>
            </div>
            
            <div className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Global Network</h3>
              <p className="text-gray-600 text-sm">
                Access to job opportunities in 180+ countries across all industries, 
                from entry-level positions to executive roles.
              </p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Step-by-Step Guidance</h3>
              <p className="text-gray-600 text-sm">
                Detailed action plans with timelines, costs, and requirements 
                to help you secure your ideal international position.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">How accurate is the AI matching?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our AI analyzes over 50 data points and has a 92% accuracy rate in predicting 
                job match success based on historical placement data.
              </p>
              
              <h3 className="font-semibold mb-2">Do you guarantee job placement?</h3>
              <p className="text-gray-600 text-sm">
                While we can't guarantee placement, our detailed guidance significantly increases 
                your chances of success. 85% of users following our Premium plan recommendations 
                secure interviews within 3 months.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Are the job opportunities legitimate?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Yes, all opportunities in our database are verified legitimate positions from 
                real companies. We work directly with employers and recruiting agencies worldwide.
              </p>
              
              <h3 className="font-semibold mb-2">What if I'm not satisfied?</h3>
              <p className="text-gray-600 text-sm">
                We offer a 30-day satisfaction guarantee. If you're not completely satisfied 
                with your job matches and guidance, we'll provide a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}