import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Folder, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface AISuggestionsProps {
  uploadedFiles: File[];
}

export default function AISuggestions({ uploadedFiles }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate AI suggestions based on uploaded files
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setLoading(true);
      
      // Simulate AI analysis
      setTimeout(() => {
        const newSuggestions = generateSuggestions(uploadedFiles);
        setSuggestions(newSuggestions);
        setLoading(false);
      }, 2000);
    }
  }, [uploadedFiles]);

  const generateSuggestions = (files: File[]) => {
    const suggestions = [];
    
    // Analyze file types and suggest organization
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const codeFiles = files.filter(f => 
      f.name.endsWith('.js') || f.name.endsWith('.ts') || 
      f.name.endsWith('.jsx') || f.name.endsWith('.tsx') ||
      f.name.endsWith('.css') || f.name.endsWith('.html')
    );
    const documentFiles = files.filter(f => 
      f.type.includes('document') || f.type.includes('pdf') || 
      f.name.endsWith('.txt') || f.name.endsWith('.md')
    );

    if (imageFiles.length > 0) {
      suggestions.push({
        id: 1,
        title: "Create Design Assets Folder",
        description: `Organize ${imageFiles.length} image files into a dedicated design folder`,
        type: "folder-creation",
        confidence: 95,
        files: imageFiles.length,
        action: "Create folder 'Design Assets' and move image files"
      });
    }

    if (codeFiles.length > 0) {
      suggestions.push({
        id: 2,
        title: "Setup Development Project",
        description: `Structure ${codeFiles.length} code files into a proper project layout`,
        type: "project-structure",
        confidence: 88,
        files: codeFiles.length,
        action: "Create folders: src/, assets/, docs/ and organize by file type"
      });
    }

    if (documentFiles.length > 0) {
      suggestions.push({
        id: 3,
        title: "Documentation Folder",
        description: `Group ${documentFiles.length} documents for easy reference`,
        type: "documentation",
        confidence: 92,
        files: documentFiles.length,
        action: "Create 'Documentation' folder and categorize by content"
      });
    }

    // Add general suggestions
    if (files.length > 5) {
      suggestions.push({
        id: 4,
        title: "Project-Based Organization",
        description: "Consider organizing files by project rather than file type",
        type: "general",
        confidence: 85,
        files: files.length,
        action: "Create project folders and distribute files accordingly"
      });
    }

    return suggestions;
  };

  const applySuggestion = (suggestion: any) => {
    // In a real app, this would trigger the actual organization
    console.log("Applying suggestion:", suggestion);
  };

  if (uploadedFiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Suggestions
          </CardTitle>
          <CardDescription>
            Upload files to get intelligent organization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500">
            No files uploaded yet. Upload some files to see AI-powered organization suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Suggestions
        </CardTitle>
        <CardDescription>
          Smart organization recommendations based on your files
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary animate-spin" />
              <span className="text-sm text-gray-600">Analyzing your files...</span>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.confidence}% confident
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-3">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Affects {suggestion.files} files
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion(suggestion)}
                    className="text-xs h-7"
                  >
                    Apply <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <strong>Action:</strong> {suggestion.action}
                  </p>
                </div>
              </div>
            ))}
            
            {suggestions.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Your files look well organized already!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
