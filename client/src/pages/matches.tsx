import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, MapPin, Building, DollarSign, Clock, CheckCircle, TrendingUp, Users, Sparkles, FileText } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Matches() {
  const { toast } = useToast();
  const [userId] = useState("user-1"); // In a real app, get from auth context

  const { data: matches = [], isLoading, error } = useQuery({
    queryKey: ['/api/matches', userId],
    queryFn: () => apiRequest('GET', `/api/matches/${userId}`).then(res => res.json())
  });

  const matchJobsMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/match-jobs", { userId }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches', userId] });
      toast({
        title: "New Matches Found!",
        description: "We've found new job opportunities that match your profile.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Finding Matches",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });

  const formatSalary = (salary: any) => {
    if (!salary) return "Salary not specified";
    const formatter = new Intl.NumberFormat('en-US');
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} ${salary.currency}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Matches</h1>
            <p className="text-gray-600 mb-6">Please try again later or create your profile first.</p>
            <Button onClick={() => window.location.href = '/profile'}>Create Profile</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Job Matches
            </h1>
            <p className="text-xl text-gray-600">
              AI-powered job recommendations tailored to your profile and success probability.
            </p>
          </div>
          <Button 
            onClick={() => matchJobsMutation.mutate()} 
            disabled={matchJobsMutation.isPending}
            data-testid="button-find-new-matches"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {matchJobsMutation.isPending ? "Finding Matches..." : "Find New Matches"}
          </Button>
        </div>

        {/* Stats Overview */}
        {matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{matches.length}</div>
                <div className="text-sm text-gray-600">Total Matches</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {matches.filter((m: any) => m.matchScore >= 80).length}
                </div>
                <div className="text-sm text-gray-600">High Match (80%+)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {matches.filter((m: any) => m.job?.visaSponsorship).length}
                </div>
                <div className="text-sm text-gray-600">Visa Sponsored</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(matches.reduce((acc: number, m: any) => acc + m.successProbability, 0) / matches.length) || 0}%
                </div>
                <div className="text-sm text-gray-600">Avg. Success Rate</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Matches State */}
        {!isLoading && matches.length === 0 && (
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Matches Yet</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We haven't found any job matches for you yet. This could be because you haven't created 
              your profile or we need to analyze more opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.href = '/profile'} data-testid="button-create-profile">
                <Users className="h-4 w-4 mr-2" />
                Complete Your Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => matchJobsMutation.mutate()} 
                disabled={matchJobsMutation.isPending}
                data-testid="button-start-matching"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Job Matching
              </Button>
            </div>
          </div>
        )}

        {/* Matches List */}
        {matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match: any) => (
              <Card key={match.id} className="hover:shadow-xl transition-shadow duration-300" data-testid={`match-card-${match.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className={`${getMatchScoreColor(match.matchScore)} font-semibold`}>
                      {match.matchScore}% Match
                    </Badge>
                    <Badge className={`${getDifficultyColor(match.overallDifficulty)} border-0`}>
                      {match.overallDifficulty} difficulty
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl text-blue-600">
                    {match.job?.title}
                  </CardTitle>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building className="h-4 w-4 mr-2" />
                      {match.job?.company}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {match.job?.city}, {match.job?.country}
                    </div>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatSalary(match.job?.salary)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Success Probability */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Success Probability</span>
                        <span className="text-sm font-medium">{match.successProbability}%</span>
                      </div>
                      <Progress value={match.successProbability} className="h-2" />
                    </div>
                    
                    {/* AI Analysis */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">AI Analysis</h4>
                      <p className="text-blue-700 text-sm">{match.matchAnalysis}</p>
                    </div>
                    
                    {/* Required Steps */}
                    <div>
                      <h4 className="font-medium mb-2">Action Steps ({match.requiredSteps?.length || 0})</h4>
                      <div className="space-y-2">
                        {match.requiredSteps?.slice(0, 2).map((step: any, index: number) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{step.title}</div>
                              <div className="text-gray-600 text-xs">{step.estimatedTime}</div>
                            </div>
                          </div>
                        ))}
                        {(match.requiredSteps?.length || 0) > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{(match.requiredSteps?.length || 0) - 2} more steps
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Job Details */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      {match.job?.visaSponsorship && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Visa Sponsored
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {match.job?.industry}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {match.job?.experienceRequired}+ years exp.
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.href = `/documents?userId=${userId}&jobId=${match.job?.id}&matchId=${match.id}`}
                        data-testid={`button-generate-documents-${match.id}`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Documents
                      </Button>
                      <Button data-testid={`button-view-details-${match.id}`}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View & Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}