import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProjectGallery from "@/components/portfolio/project-gallery";
import { ExternalLink, Github, Calendar, Tag } from "lucide-react";

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const projects = [
    {
      id: 1,
      title: "E-commerce Mobile App",
      description: "A modern React Native app for seamless shopping experience with AI-powered recommendations.",
      category: "mobile",
      tags: ["React Native", "TypeScript", "AI/ML"],
      date: "2024-08",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&crop=center",
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 2,
      title: "Portfolio Website Design",
      description: "Clean and professional portfolio website built with modern web technologies.",
      category: "web",
      tags: ["React", "Tailwind CSS", "Framer Motion"],
      date: "2024-07",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 3,
      title: "Brand Identity Package",
      description: "Complete brand identity design including logo, color palette, and marketing materials.",
      category: "design",
      tags: ["Branding", "Logo Design", "Adobe Creative Suite"],
      date: "2024-06",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop&crop=center",
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 4,
      title: "Data Visualization Dashboard",
      description: "Interactive dashboard for real-time data analytics with beautiful charts and insights.",
      category: "web",
      tags: ["React", "D3.js", "Python", "API"],
      date: "2024-05",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
      githubUrl: "#",
      liveUrl: "#"
    }
  ];

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "design", label: "Design" }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            My Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A collection of projects showcasing my skills in web development, 
            mobile apps, and creative design. Each project represents a journey 
            of problem-solving and innovation.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <Button size="sm" variant="secondary" className="rounded-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button size="sm" variant="secondary" className="rounded-full">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {project.date}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in Working Together?
          </h2>
          <p className="text-gray-600 mb-8">
            I'm always open to discussing new opportunities and creative projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Get In Touch
            </Button>
            <Button variant="outline" size="lg">
              Download Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
