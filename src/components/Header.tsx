
import { Bird } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 backdrop-blur-lg bg-background/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bird className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-display font-semibold tracking-tight">
              鸟巢<span className="text-primary">检测</span>
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              智能鸟巢识别技术
            </p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#upload-section" className="text-sm font-medium animated-border-button">
            开始使用
          </a>
          <button className="rounded-full px-4 py-2 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            联系我们
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
