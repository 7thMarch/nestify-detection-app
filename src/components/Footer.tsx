
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto backdrop-blur-lg bg-background/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>为鸟类爱好者倾心设计</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} 鸟巢检测. 保留所有权利.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
