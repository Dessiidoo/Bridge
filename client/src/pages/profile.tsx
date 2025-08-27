import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { User, Globe, Briefcase, GraduationCap, MapPin, Target, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const profileSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.number().min(16, "Must be at least 16 years old").max(80, "Must be under 80"),
  nationality: z.string().min(2, "Please select your nationality"),
  currentLocation: z.string().min(2, "Please enter your current location"),
  languages: z.array(z.string()).min(1, "Please add at least one language"),
  education: z.string().min(1, "Please select your education level"),
  skills: z.array(z.string()).min(1, "Please add at least one skill"),
  preferredCountries: z.array(z.string()).min(1, "Please select at least one preferred country"),
  preferredIndustries: z.array(z.string()).min(1, "Please select at least one preferred industry"),
  salaryExpectation: z.object({
    min: z.number().min(0, "Minimum salary must be positive"),
    max: z.number().min(0, "Maximum salary must be positive"),
    currency: z.string().min(1, "Please select a currency"),
  }),
  willingToRelocate: z.boolean(),
  hasPassport: z.boolean(),
  workExperience: z.array(z.object({
    title: z.string(),
    industry: z.string(),
    yearsOfExperience: z.number(),
    description: z.string().optional(),
  })),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form state for dynamic arrays
  const [languages, setLanguages] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [preferredCountries, setPreferredCountries] = useState<string[]>([]);
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  
  // Temporary input states
  const [languageInput, setLanguageInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      willingToRelocate: true,
      hasPassport: false,
      salaryExpectation: {
        currency: "USD"
      }
    }
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => 
      apiRequest("POST", "/api/user-profile", data).then(res => res.json()),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-profile'] });
      toast({
        title: "Profile Created Successfully!",
        description: "Your profile has been saved. Let's find you some job matches!",
      });
      setLocation("/matches");
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Profile",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  });

  const addLanguage = () => {
    if (languageInput && !languages.includes(languageInput)) {
      const newLanguages = [...languages, languageInput];
      setLanguages(newLanguages);
      setValue("languages", newLanguages);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    const newLanguages = languages.filter(l => l !== lang);
    setLanguages(newLanguages);
    setValue("languages", newLanguages);
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      const newSkills = [...skills, skillInput];
      setSkills(newSkills);
      setValue("skills", newSkills);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter(s => s !== skill);
    setSkills(newSkills);
    setValue("skills", newSkills);
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    let newCountries;
    if (checked) {
      newCountries = [...preferredCountries, country];
    } else {
      newCountries = preferredCountries.filter(c => c !== country);
    }
    setPreferredCountries(newCountries);
    setValue("preferredCountries", newCountries);
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    let newIndustries;
    if (checked) {
      newIndustries = [...preferredIndustries, industry];
    } else {
      newIndustries = preferredIndustries.filter(i => i !== industry);
    }
    setPreferredIndustries(newIndustries);
    setValue("preferredIndustries", newIndustries);
  };

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, {
      title: "",
      industry: "",
      yearsOfExperience: 0,
      description: ""
    }]);
  };

  const removeWorkExperience = (index: number) => {
    const newExperience = workExperience.filter((_, i) => i !== index);
    setWorkExperience(newExperience);
    setValue("workExperience", newExperience);
  };

  const onSubmit = (data: ProfileFormData) => {
    // Ensure arrays are properly set
    data.languages = languages;
    data.skills = skills;
    data.preferredCountries = preferredCountries;
    data.preferredIndustries = preferredIndustries;
    data.workExperience = workExperience;
    
    createProfileMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Create Your Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us understand your background and career goals so we can find the perfect 
            international job opportunities for you.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      data-testid="input-full-name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      data-testid="input-email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register("age", { valueAsNumber: true })}
                      data-testid="input-age"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      {...register("nationality")}
                      placeholder="e.g. American, Canadian, British"
                      data-testid="input-nationality"
                    />
                    {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="currentLocation">Current Location *</Label>
                    <Input
                      id="currentLocation"
                      {...register("currentLocation")}
                      placeholder="e.g. New York, USA"
                      data-testid="input-current-location"
                    />
                    {errors.currentLocation && <p className="text-red-500 text-sm mt-1">{errors.currentLocation.message}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div></div>
                  <Button type="button" onClick={nextStep} data-testid="button-next-step-1">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Languages and Education */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  Languages & Education
                </CardTitle>
                <CardDescription>Your language skills and educational background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Languages You Speak *</Label>
                  <div className="flex gap-2 mt-2 mb-3">
                    <Input
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      placeholder="Add a language"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                      data-testid="input-add-language"
                    />
                    <Button type="button" onClick={addLanguage} data-testid="button-add-language">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                        {lang}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(lang)} />
                      </Badge>
                    ))}
                  </div>
                  {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages.message}</p>}
                </div>

                <div>
                  <Label htmlFor="education">Highest Education Level *</Label>
                  <Select onValueChange={(value) => setValue("education", value)}>
                    <SelectTrigger data-testid="select-education">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No formal education</SelectItem>
                      <SelectItem value="primary">Primary school</SelectItem>
                      <SelectItem value="secondary">High school / Secondary</SelectItem>
                      <SelectItem value="vocational">Vocational training</SelectItem>
                      <SelectItem value="bachelor">Bachelor's degree</SelectItem>
                      <SelectItem value="master">Master's degree</SelectItem>
                      <SelectItem value="phd">PhD / Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>}
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hasPassport" 
                      onCheckedChange={(checked) => setValue("hasPassport", !!checked)}
                      data-testid="checkbox-has-passport"
                    />
                    <Label htmlFor="hasPassport">I have a valid passport</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="willingToRelocate" 
                      defaultChecked={true}
                      onCheckedChange={(checked) => setValue("willingToRelocate", !!checked)}
                      data-testid="checkbox-willing-relocate"
                    />
                    <Label htmlFor="willingToRelocate">Willing to relocate internationally</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Button type="button" variant="outline" onClick={prevStep} data-testid="button-prev-step-2">
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep} data-testid="button-next-step-2">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional steps would follow similar pattern... */}
          {/* For brevity, I'll just show the final step */}

          {/* Step 5: Salary & Preferences */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Final Details
                </CardTitle>
                <CardDescription>Salary expectations and submit your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">Salary Expectations (Annual)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="minSalary">Minimum</Label>
                      <Input
                        id="minSalary"
                        type="number"
                        {...register("salaryExpectation.min", { valueAsNumber: true })}
                        placeholder="50000"
                        data-testid="input-min-salary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxSalary">Maximum</Label>
                      <Input
                        id="maxSalary"
                        type="number"
                        {...register("salaryExpectation.max", { valueAsNumber: true })}
                        placeholder="80000"
                        data-testid="input-max-salary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select onValueChange={(value) => setValue("salaryExpectation.currency", value)} defaultValue="USD">
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                          <SelectItem value="AUD">AUD (A$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {errors.salaryExpectation && (
                    <p className="text-red-500 text-sm mt-1">Please fill in your salary expectations</p>
                  )}
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Ready to find your perfect job?</h4>
                  <p className="text-blue-700 text-sm">
                    Once you submit your profile, our AI will analyze thousands of global job opportunities 
                    and calculate your success probability for each one. You'll get detailed guidance on 
                    exactly what steps to take to secure your ideal international career.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Button type="button" variant="outline" onClick={prevStep} data-testid="button-prev-step-5">
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProfileMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                    data-testid="button-create-profile"
                  >
                    {createProfileMutation.isPending ? "Creating Profile..." : "Create Profile & Find Jobs"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show intermediate steps for skills and preferences */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Skills & Experience
                </CardTitle>
                <CardDescription>What can you do? What have you done?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Your Skills *</Label>
                  <div className="flex gap-2 mt-2 mb-3">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      data-testid="input-add-skill"
                    />
                    <Button type="button" onClick={addSkill} data-testid="button-add-skill">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                  {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>
                  <Button type="button" onClick={nextStep}>Next Step</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Where Do You Want to Work?
                </CardTitle>
                <CardDescription>Select your preferred countries and industries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">Preferred Countries *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Canada", "Germany", "Netherlands", "Australia", "Sweden", "Switzerland",
                      "Norway", "Denmark", "United Kingdom", "France", "Spain", "Italy"
                    ].map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={country}
                          checked={preferredCountries.includes(country)}
                          onCheckedChange={(checked) => handleCountryChange(country, !!checked)}
                          data-testid={`checkbox-country-${country.toLowerCase().replace(' ', '-')}`}
                        />
                        <Label htmlFor={country} className="text-sm">{country}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.preferredCountries && <p className="text-red-500 text-sm mt-1">{errors.preferredCountries.message}</p>}
                </div>

                <div>
                  <Label className="text-base font-semibold mb-4 block">Preferred Industries *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Technology", "Agriculture", "Hospitality", "Construction", "Healthcare",
                      "Education", "Manufacturing", "Finance", "Retail", "Transportation"
                    ].map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={industry}
                          checked={preferredIndustries.includes(industry)}
                          onCheckedChange={(checked) => handleIndustryChange(industry, !!checked)}
                          data-testid={`checkbox-industry-${industry.toLowerCase()}`}
                        />
                        <Label htmlFor={industry} className="text-sm">{industry}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.preferredIndustries && <p className="text-red-500 text-sm mt-1">{errors.preferredIndustries.message}</p>}
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>
                  <Button type="button" onClick={nextStep}>Next Step</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}