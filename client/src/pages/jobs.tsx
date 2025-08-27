import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Building, DollarSign, Calendar, Globe, Users, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  country: string;
  city: string;
  industry: string;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  languagesRequired: string[];
  visaSponsorship: boolean;
  experienceRequired: number;
  educationRequired: string;
  isActive: boolean;
  createdAt: string;
}

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  const { data: jobs = [], isLoading, error } = useQuery<JobOpportunity[]>({
    queryKey: ['/api/jobs', { search: searchQuery, country: countryFilter, industry: industryFilter }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (countryFilter) params.append('country', countryFilter);
      if (industryFilter) params.append('industry', industryFilter);
      return apiRequest('GET', `/api/jobs?${params.toString()}`).then(res => res.json());
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/analytics/job-stats'],
    queryFn: () => apiRequest('GET', '/api/analytics/job-stats').then(res => res.json())
  });

  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    const formatter = new Intl.NumberFormat('en-US');
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} ${salary.currency.toUpperCase()}`;
  };

  const getEducationLevel = (education: string) => {
    const levels = {
      'none': 'No formal education required',
      'primary': 'Primary education',
      'secondary': 'Secondary education',
      'vocational': 'Vocational training',
      'bachelor': "Bachelor's degree",
      'master': "Master's degree",
      'phd': 'PhD required'
    };
    return levels[education as keyof typeof levels] || education;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Jobs</h1>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Global Job Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover legitimate job opportunities from around the world. Every job includes detailed requirements 
            and visa sponsorship information.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.visaSponsorshipPercentage}%</div>
                <div className="text-sm text-gray-600">Visa Sponsored</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.topCountries?.length || 0}</div>
                <div className="text-sm text-gray-600">Countries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.topIndustries?.length || 0}</div>
                <div className="text-sm text-gray-600">Industries</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Find Your Perfect Job</CardTitle>
            <CardDescription>Filter by location, industry, or search for specific roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-job-search"
                  />
                </div>
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger data-testid="select-country">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="Netherlands">Netherlands</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Sweden">Sweden</SelectItem>
                  <SelectItem value="Switzerland">Switzerland</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger data-testid="select-industry">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow duration-300 group" data-testid={`job-card-${job.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Active</span>
                    </div>
                    {job.visaSponsorship && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Visa Sponsored
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building className="h-4 w-4 mr-2" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.city}, {job.country}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatSalary(job.salary)}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {job.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        <strong>Experience:</strong> {job.experienceRequired} years minimum
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>Education:</strong> {getEducationLevel(job.educationRequired)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {job.languagesRequired.slice(0, 2).map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          {lang}
                        </Badge>
                      ))}
                      {job.languagesRequired.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.languagesRequired.length - 2} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge variant="outline" className="text-xs">
                        {job.industry}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" size="sm" data-testid={`button-view-details-${job.id}`}>
                      View Details & Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {jobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}