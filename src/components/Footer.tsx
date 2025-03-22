
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Designed with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for bird enthusiasts</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BirdNest Detect. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
