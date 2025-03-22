
import { useState, useEffect, useRef } from "react";
import { NestDetectionResult } from "@/types";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoundingBox from "./BoundingBox";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: NestDetectionResult | null;
  imageUrl: string | null;
  isLoading: boolean;
  onReset: () => void;
}

const ResultDisplay = ({
  result,
  imageUrl,
  isLoading,
  onReset,
}: ResultDisplayProps) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (result && !isLoading) {
      // Delay the animation to ensure smooth transition
      const timer = setTimeout(() => {
        setAnimateIn(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [result, isLoading]);

  useEffect(() => {
    // Reset error state when imageUrl changes
    setImageError(false);
    
    const updateImageSize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight,
        });
      }
    };

    if (imageRef.current) {
      imageRef.current.onload = updateImageSize;
      if (imageRef.current.complete) {
        updateImageSize();
      }
    }
  }, [imageUrl]);

  const handleImageError = () => {
    setImageError(true);
  };

  if (!imageUrl && !isLoading) return null;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full transition-all duration-500 transform mt-8",
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <div className="rounded-2xl border overflow-hidden bg-card shadow-sm mb-6">
        <div className="relative">
          <div className="aspect-video overflow-hidden bg-black/5">
            {imageUrl && !imageError ? (
              <>
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Analyzed image"
                  className="object-contain w-full h-full"
                  onError={handleImageError}
                />
                {result && result.found && result.position && (
                  <BoundingBox
                    position={result.position}
                    imageSize={imageSize}
                  />
                )}
              </>
            ) : imageError ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <XCircle className="h-8 w-8 mb-2" />
                <p>Failed to load image</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-3 py-4">
              <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
              <p className="text-muted-foreground text-sm">Analyzing image...</p>
            </div>
          ) : (
            result && (
              <div className="flex flex-col">
                <div className="flex items-center space-x-3 mb-4">
                  {result.found ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <h3 className="text-lg font-display font-medium">Bird nest detected</h3>
                        <p className="text-sm text-muted-foreground">
                          A bird nest was found in the image
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      <div>
                        <h3 className="text-lg font-display font-medium">No bird nest detected</h3>
                        <p className="text-sm text-muted-foreground">
                          No bird nest was found in the image
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {result.found && result.position && (
                  <div className="p-4 bg-accent rounded-lg mb-4">
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <Info className="h-4 w-4 mr-2 text-primary" />
                      Nest Location
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-background px-3 py-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Top-left</p>
                        <p className="text-sm font-medium">
                          X: {result.position.x1}, Y: {result.position.y1}
                        </p>
                      </div>
                      <div className="bg-background px-3 py-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Bottom-right</p>
                        <p className="text-sm font-medium">
                          X: {result.position.x2}, Y: {result.position.y2}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!result.found && result.description && (
                  <div className="p-4 bg-accent rounded-lg mb-4">
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <Info className="h-4 w-4 mr-2 text-primary" />
                      Image Description
                    </h4>
                    <p className="text-sm">{result.description}</p>
                  </div>
                )}

                <Button onClick={onReset} className="w-full mt-2">
                  Analyze Another Image
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
