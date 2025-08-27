import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Coffee, Star, Users, Target, CheckCircle } from "lucide-react";

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");

  const predefinedAmounts = [10, 25, 50, 100];

  const supportTiers = [
    {
      icon: Coffee,
      title: "Coffee Supporter",
      amount: "$5-15",
      description: "Buy me a coffee to fuel late-night coding sessions",
      benefits: ["Thank you message", "Updates on new features"]
    },
    {
      icon: Heart,
      title: "Project Supporter",
      amount: "$25-50",
      description: "Support ongoing development and new features",
      benefits: ["Early access to features", "Priority support", "Supporter badge"]
    },
    {
      icon: Star,
      title: "Premium Supporter",
      amount: "$100+",
      description: "Become a key supporter of the platform",
      benefits: ["All previous benefits", "Monthly video calls", "Feature requests priority"]
    }
  ];

  const goals = [
    {
      title: "Server Hosting",
      current: 450,
      target: 600,
      description: "Monthly server costs for reliable hosting"
    },
    {
      title: "AI API Credits",
      current: 280,
      target: 500,
      description: "AI processing for file organization features"
    },
    {
      title: "Development Tools",
      current: 120,
      target: 300,
      description: "Professional development tools and licenses"
    }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Support My Work
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help me continue building amazing tools and features for creatives. 
            Your support enables me to dedicate more time to development and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Make a Donation
                </CardTitle>
                <CardDescription>
                  Choose an amount that feels right for you. Every contribution helps!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        onClick={() => handleAmountSelect(amount)}
                        className="h-12"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    placeholder="Custom amount ($)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave a Message (Optional)
                  </label>
                  <Textarea
                    placeholder="Share what you appreciate about the project or what features you'd like to see..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Donation Button */}
                <div className="pt-4">
                  <Button size="lg" className="w-full text-lg">
                    <Heart className="h-5 w-5 mr-2" />
                    Donate ${customAmount || selectedAmount}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Secure payment processing via Stripe
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Support Tiers</CardTitle>
                <CardDescription>
                  Different ways you can support the project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {supportTiers.map((tier, index) => {
                    const IconComponent = tier.icon;
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{tier.title}</h3>
                              <span className="text-lg font-bold text-primary">{tier.amount}</span>
                            </div>
                            <p className="text-gray-600 mb-3">{tier.description}</p>
                            <ul className="space-y-1">
                              {tier.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-500" />
                  Funding Goals
                </CardTitle>
                <CardDescription>
                  Current progress towards monthly goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals.map((goal, index) => {
                  const percentage = (goal.current / goal.target) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        <span className="text-sm text-gray-600">
                          ${goal.current}/${goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">{goal.description}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">127</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">23</div>
                  <div className="text-sm text-gray-600">Supporters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">1,240</div>
                  <div className="text-sm text-gray-600">Files Organized</div>
                </div>
              </CardContent>
            </Card>

            {/* Thank You */}
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Thank You!</h3>
                <p className="text-sm text-gray-600">
                  Your support makes it possible to continue improving and adding new features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
