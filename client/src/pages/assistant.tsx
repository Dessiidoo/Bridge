import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/assistant/chat-interface";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Phone, Code, Lightbulb, Clock } from "lucide-react";

export default function Assistant() {
  const [activeFeature, setActiveFeature] = useState("chat");

  const features = [
    {
      id: "job-matching",
      title: "Job Matching",
      description: "Get AI-powered job recommendations based on your profile",
      icon: Sparkles,
      status: "available"
    },
    {
      id: "visa-guidance",
      title: "Visa & Immigration",
      description: "Expert guidance on work visas and immigration requirements",
      icon: Calendar,
      status: "available"
    },
    {
      id: "career-planning",
      title: "Career Planning",
      description: "Strategic advice for your international career journey",
      icon: Code,
      status: "available"
    },
    {
      id: "application-help",
      title: "Application Support",
      description: "Resume optimization and interview preparation tips",
      icon: Phone,
      status: "available"
    }
  ];

  const quickActions = [
    "Find jobs in Germany for software developers",
    "What visa do I need to work in Canada?",
    "Help me optimize my resume for international jobs",
    "Compare salaries in different countries",
    "What are the requirements for working in Australia?",
    "How do I prepare for remote job interviews?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Bridge AI Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your intelligent companion for international job placement. Get expert guidance on 
            visa requirements, application strategies, and career planning across all countries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Features Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        feature.status === 'available' 
                          ? 'hover:bg-primary/5 border-primary/20' 
                          : 'opacity-60 cursor-not-allowed border-gray-200'
                      }`}
                      onClick={() => feature.status === 'available' && setActiveFeature(feature.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className={`h-5 w-5 mt-0.5 ${
                          feature.status === 'available' ? 'text-primary' : 'text-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm">{feature.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                          {feature.status === 'coming-soon' && (
                            <div className="flex items-center mt-2">
                              <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-yellow-600">Coming Soon</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common tasks to get you started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 text-wrap"
                  >
                    <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-500" />
                    <span className="text-sm">{action}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  AI Assistant Chat
                </CardTitle>
                <CardDescription>
                  Ask me anything about organizing your files, planning projects, or creative guidance.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ChatInterface />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What Can I Help You With?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className={`text-center hover:shadow-lg transition-shadow ${
                  feature.status === 'coming-soon' ? 'opacity-60' : ''
                }`}>
                  <CardHeader>
                    <IconComponent className={`h-12 w-12 mx-auto mb-4 ${
                      feature.status === 'available' ? 'text-primary' : 'text-gray-400'
                    }`} />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                    {feature.status === 'coming-soon' && (
                      <div className="flex items-center justify-center mt-4">
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-yellow-600 font-medium">Coming Soon</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
