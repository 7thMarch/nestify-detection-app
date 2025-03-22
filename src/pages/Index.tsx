
import { useState } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import UrlInput from "@/components/UrlInput";
import ResultDisplay from "@/components/ResultDisplay";
import Footer from "@/components/Footer";
import { UploadedImage, NestDetectionResult } from "@/types";
import { detectNestFromFile, detectNestFromUrl } from "@/services/nestDetectionService";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<NestDetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (image: UploadedImage) => {
    setUploadedImage(image);
    setAnalysisImageUrl(null);
    setResult(null);
    setIsAnalyzing(true);
    
    try {
      toast.info("Uploading and analyzing image...");
      const detectionResult = await detectNestFromFile(image.file);
      setResult(detectionResult);
      
      toast.success(
        detectionResult.found
          ? "Bird nest detected successfully!"
          : "Analysis complete. No bird nest found."
      );
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    // Clean up previous upload if exists
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    
    setUploadedImage(null);
    setAnalysisImageUrl(url);
    setResult(null);
    setIsAnalyzing(true);
    
    try {
      toast.info("Analyzing image from URL...");
      const detectionResult = await detectNestFromUrl(url);
      setResult(detectionResult);
      
      toast.success(
        detectionResult.found
          ? "Bird nest detected successfully!"
          : "Analysis complete. No bird nest found."
      );
    } catch (error) {
      console.error("Error processing image URL:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    // Release object URL to prevent memory leaks
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    
    setUploadedImage(null);
    setAnalysisImageUrl(null);
    setResult(null);
  };

  // Main display image URL (either from file upload preview or direct URL analysis)
  const displayImageUrl = uploadedImage?.preview || analysisImageUrl;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 animate-fade-in">
              Advanced AI-Powered Technology
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight mb-6 animate-slide-up">
              Bird Nest <span className="text-primary">Detection</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
              Upload an image or provide a URL and our AI will instantly detect if there's a bird nest
              present and pinpoint its exact location with precision.
            </p>
            
            <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <a 
                href="#upload-section" 
                className="inline-block rounded-full bg-primary text-white font-medium px-6 py-3 hover:bg-primary/90 transition-colors"
              >
                Try It Now
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center text-sm mt-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                Learn how it works
                <ChevronDown className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
        
        {/* Upload Section */}
        <section id="upload-section" className="py-8 md:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-3">
                Analyze an Image
              </h2>
              <p className="text-muted-foreground">
                Upload an image, paste a URL, or drag and drop to detect bird nests
              </p>
            </div>
            
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              isLoading={isAnalyzing} 
            />
            
            <UrlInput
              onUrlSubmit={handleUrlSubmit}
              isLoading={isAnalyzing}
            />
            
            <ResultDisplay 
              result={result} 
              imageUrl={displayImageUrl || null} 
              isLoading={isAnalyzing}
              onReset={handleReset}
            />
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-3">
                How It Works
              </h2>
              <p className="text-muted-foreground">
                Our advanced AI system analyzes your images in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Upload or Paste URL",
                  description: "Upload any image or provide a URL containing potential bird nests for analysis."
                },
                {
                  step: "2",
                  title: "Analyze",
                  description: "Our AI examines the image for patterns consistent with bird nests."
                },
                {
                  step: "3",
                  title: "Results",
                  description: "Get instant results with precise nest locations or detailed descriptions."
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="relative bg-card rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-display font-medium mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
