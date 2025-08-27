import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/organize/file-upload";
import AISuggestions from "@/components/organize/ai-suggestions";
import { Folder, FileText, Image, Code, Star, Calendar } from "lucide-react";

export default function Organize() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [organizedProjects, setOrganizedProjects] = useState([
    {
      id: 1,
      name: "Website Projects",
      type: "folder",
      files: 12,
      lastModified: "2024-08-20",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      name: "Design Assets",
      type: "folder",
      files: 28,
      lastModified: "2024-08-18",
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: 3,
      name: "Mobile Apps",
      type: "folder",
      files: 8,
      lastModified: "2024-08-15",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 4,
      name: "Documentation",
      type: "folder",
      files: 15,
      lastModified: "2024-08-10",
      color: "bg-yellow-100 text-yellow-800"
    }
  ]);

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return Folder;
      case 'image':
        return Image;
      case 'code':
        return Code;
      default:
        return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Organize Your Files
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let our AI assistant help you organize your files into neat, 
            categorized folders for easy access and better project management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
                <TabsTrigger value="organized">Organized Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Your Files</CardTitle>
                    <CardDescription>
                      Upload your files and let our AI organize them into meaningful project folders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload onFilesUploaded={handleFilesUploaded} />
                  </CardContent>
                </Card>

                {uploadedFiles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recently Uploaded</CardTitle>
                      <CardDescription>
                        {uploadedFiles.length} files uploaded and ready for organization.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {uploadedFiles.slice(0, 5).map((file, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-700 truncate flex-1">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        ))}
                        {uploadedFiles.length > 5 && (
                          <p className="text-sm text-gray-500 text-center pt-2">
                            and {uploadedFiles.length - 5} more files...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="organized" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Organized Projects</CardTitle>
                    <CardDescription>
                      AI-organized project folders for easy access and management.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {organizedProjects.map((project) => {
                        const IconComponent = getFileIcon(project.type);
                        return (
                          <div
                            key={project.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${project.color}`}>
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                  {project.name}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <FileText className="h-4 w-4 mr-1" />
                                  {project.files} files
                                </p>
                                <p className="text-xs text-gray-400 flex items-center mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Last modified: {project.lastModified}
                                </p>
                              </div>
                              <Star className="h-5 w-5 text-gray-300 hover:text-yellow-500 transition-colors" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AISuggestions uploadedFiles={uploadedFiles} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Folder className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Project-Based Structure</h4>
                      <p className="text-xs text-gray-600">Group files by project for better organization</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Consistent Naming</h4>
                      <p className="text-xs text-gray-600">Use clear, descriptive file names</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Regular Cleanup</h4>
                      <p className="text-xs text-gray-600">Archive old projects periodically</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
