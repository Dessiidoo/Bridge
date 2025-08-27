import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. I can help you organize your files, plan projects, and provide creative guidance. What would you like to work on today?",
      sender: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Help me organize my design files",
    "Create a folder structure for a web project",
    "Suggest naming conventions for my photos",
    "How should I structure my portfolio?",
    "Plan a timeline for my new project"
  ];

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("organize") || lowerMessage.includes("files")) {
      return "I'd be happy to help you organize your files! Here are some suggestions:\n\n• **Project-based structure**: Create main folders for each project\n• **File type categorization**: Separate images, documents, and code files\n• **Consistent naming**: Use descriptive names with dates (YYYY-MM-DD format)\n• **Archive old projects**: Keep your workspace clean\n\nWould you like me to suggest a specific folder structure for your current project?";
    }
    
    if (lowerMessage.includes("folder structure") || lowerMessage.includes("structure")) {
      return "Here's a recommended folder structure for a typical creative project:\n\n📁 **Project Name**\n├── 📁 Assets\n│   ├── 📁 Images\n│   ├── 📁 Icons\n│   └── 📁 Fonts\n├── 📁 Source Files\n│   ├── 📁 Design Files (.psd, .ai, .figma)\n│   └── 📁 Code (.html, .css, .js)\n├── 📁 Documentation\n│   ├── 📄 README.md\n│   └── 📄 Project Brief\n└── 📁 Exports\n    ├── 📁 Final Files\n    └── 📁 Archive\n\nThis structure scales well and keeps everything organized!";
    }
    
    if (lowerMessage.includes("naming") || lowerMessage.includes("convention")) {
      return "Great naming conventions make a huge difference! Here are my recommendations:\n\n**For Photos/Images:**\n• Use descriptive names: `sunset-beach-2024-08-15.jpg`\n• Include dates for chronological sorting\n• Use hyphens instead of spaces\n\n**For Project Files:**\n• Be descriptive: `logo-design-v3-final.ai`\n• Include version numbers\n• Add status indicators: `-draft`, `-review`, `-final`\n\n**For Code Files:**\n• Use camelCase or kebab-case consistently\n• Be descriptive: `userProfileComponent.jsx`\n\nWant me to help rename some specific files?";
    }
    
    if (lowerMessage.includes("portfolio")) {
      return "Let's create an amazing portfolio structure! Here's what I recommend:\n\n**Portfolio Sections:**\n1. **Hero/About** - Your story and skills\n2. **Featured Projects** - 3-5 best works\n3. **Project Gallery** - Categorized by type\n4. **Skills & Tools** - What you work with\n5. **Contact** - How to reach you\n\n**For Each Project Include:**\n• High-quality preview images\n• Project description and goals\n• Technologies/tools used\n• Live demo and source code links\n• Your role and responsibilities\n\nWhat type of work do you primarily showcase?";
    }
    
    if (lowerMessage.includes("timeline") || lowerMessage.includes("plan")) {
      return "Project planning is crucial for success! Here's a template timeline:\n\n**Week 1: Discovery & Planning**\n• Define goals and requirements\n• Research and inspiration gathering\n• Create project structure\n\n**Week 2-3: Development**\n• Core functionality/design\n• Iterative development\n• Regular check-ins\n\n**Week 4: Polish & Launch**\n• Testing and refinements\n• Final optimizations\n• Launch and documentation\n\n**Tips:**\n• Add 20% buffer time for unexpected issues\n• Set daily/weekly milestones\n• Regular backups and version control\n\nWhat's your project about? I can create a more specific timeline!";
    }
    
    return "I understand you're looking for help! I specialize in:\n\n• **File Organization** - Structuring and naming your files\n• **Project Planning** - Creating timelines and workflows\n• **Portfolio Development** - Showcasing your work effectively\n• **Creative Guidance** - Best practices and recommendations\n\nCould you tell me more about what specific challenge you're facing? I'm here to help you stay organized and productive!";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue),
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={cn(
                  "text-xs mt-1 opacity-70",
                  message.sender === "user" ? "text-white" : "text-gray-500"
                )}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {message.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="p-4 border-t bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
            Quick Suggestions
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs h-7"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about organizing files, planning projects, or anything else..."
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
