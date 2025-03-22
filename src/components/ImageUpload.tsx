
import { useState, useCallback, useRef, DragEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedImage } from "@/types";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void;
  isLoading: boolean;
}

const ImageUpload = ({ onImageUpload, isLoading }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        processFile(file);
      }
    },
    [onImageUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        processFile(file);
        e.target.value = ''; // Reset the input
      }
    },
    [onImageUpload]
  );

  const processFile = (file: File) => {
    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    const preview = URL.createObjectURL(file);
    onImageUpload({ preview, file });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center px-4 transition-all duration-300 overflow-hidden",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          isLoading && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-float">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-display text-lg font-medium">
              Upload an image
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Drag and drop an image, or{" "}
              <button
                type="button"
                className="text-primary hover:underline focus:outline-none"
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                browse
              </button>{" "}
              to select a file
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Supported formats: JPEG, PNG, WebP
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
