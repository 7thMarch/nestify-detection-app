
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "lucide-react";

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInput = ({ onUrlSubmit, isLoading }: UrlInputProps) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    // Simple URL validation
    try {
      new URL(imageUrl);
      onUrlSubmit(imageUrl);
    } catch (error) {
      toast.error("Please enter a valid URL");
    }
  };

  // Handle paste event for easy URL pasting
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    try {
      new URL(pastedText);
      setImageUrl(pastedText);
    } catch (error) {
      // Not a valid URL, just let the normal paste behavior happen
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Link className="h-4 w-4 mr-2" />
          Or analyze an image from URL
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onPaste={handlePaste}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !imageUrl.trim()}
          >
            Analyze
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UrlInput;
