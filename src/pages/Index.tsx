
import { useState } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import UrlInput from "@/components/UrlInput";
import ResultDisplay from "@/components/ResultDisplay";
import Footer from "@/components/Footer";
import { UploadedImage, NestDetectionResult } from "@/types";
import { detectNestFromFile, detectNestFromUrl } from "@/services/nestDetectionService";
import { toast } from "sonner";
import { Info, Camera, Link } from "lucide-react";

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
      toast.info("正在上传并分析图片...");
      const detectionResult = await detectNestFromFile(image.file);
      setResult(detectionResult);
      
      toast.success(
        detectionResult.found
          ? "成功检测到鸟巢！"
          : "分析完成，未发现鸟巢。"
      );
    } catch (error) {
      console.error("处理图片时出错:", error);
      toast.error("图片分析失败，请重试。");
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
      toast.info("正在分析URL图片...");
      const detectionResult = await detectNestFromUrl(url);
      setResult(detectionResult);
      
      toast.success(
        detectionResult.found
          ? "成功检测到鸟巢！"
          : "分析完成，未发现鸟巢。"
      );
    } catch (error) {
      console.error("处理图片URL时出错:", error);
      toast.error("图片分析失败，请重试。");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* 主页部分 */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 animate-fade-in">
              人工智能驱动技术
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight mb-6 animate-slide-up">
              鸟巢<span className="text-primary">检测</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
              上传图片或提供URL，我们的AI将立即检测图像中是否存在鸟巢并精确定位其位置。
            </p>
            
            <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <a 
                href="#upload-section" 
                className="inline-block rounded-full bg-primary text-white font-medium px-6 py-3 hover:bg-primary/90 transition-colors"
              >
                立即体验
              </a>
            </div>
          </div>
        </section>
        
        {/* 上传部分 */}
        <section id="upload-section" className="py-8 md:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-semibold mb-3">
                分析图片
              </h2>
              <p className="text-muted-foreground">
                上传图片或粘贴URL来检测鸟巢
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="ml-3 text-xl font-display font-medium">上传图片</h3>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">
                  您可以上传本地图片或直接拖放图片到上传区域
                </p>
                <ImageUpload 
                  onImageUpload={handleImageUpload} 
                  isLoading={isAnalyzing} 
                />
              </div>
              
              <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                    <Link className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="ml-3 text-xl font-display font-medium">图片URL</h3>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">
                  输入网络图片的URL地址进行分析
                </p>
                <UrlInput
                  onUrlSubmit={handleUrlSubmit}
                  isLoading={isAnalyzing}
                />
              </div>
            </div>
            
            {/* 使用说明与注意事项 */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <h3 className="ml-3 text-lg font-display font-medium">使用说明与注意事项</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>支持上传JPG、PNG和GIF格式的图片，最大文件大小为10MB</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>为获得最佳分析效果，请上传清晰且鸟巢区域可见的图片</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>分析过程可能需要几秒钟，请耐心等待</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>如果检测结果不准确，可尝试不同角度的图片或更高质量的图像</span>
                </li>
              </ul>
            </div>
            
            <ResultDisplay 
              result={result} 
              imageUrl={displayImageUrl || null} 
              isLoading={isAnalyzing}
              onReset={handleReset}
            />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
