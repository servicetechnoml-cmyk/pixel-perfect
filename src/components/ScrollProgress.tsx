import { useEffect, useState } from "react";
import { Zap, ArrowUp } from "lucide-react";

export default function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const percentage = (scrollTop / scrollHeight) * 100;
        setScrollPercentage(percentage);
        
        // Only show the indicator if we've scrolled down a bit
        setIsVisible(scrollTop > 100);
      } else {
        setScrollPercentage(0);
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const radius = 24;
  const stroke = 3.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[100] flex items-center justify-center transition-all duration-300 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="group relative flex items-center justify-center bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border/50 hover:bg-background/95 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Scroll to top"
      >
        <svg
          height={radius * 2}
          width={radius * 2}
          className="-rotate-90 transform"
        >
          {/* Background Track */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-muted/30"
          />
          {/* Progress (Charging) Fill */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-primary transition-[stroke-dashoffset] duration-150 ease-out drop-shadow-[0_0_8px_rgba(var(--primary),0.6)]"
          />
        </svg>
        
        {/* Center Icons */}
        <div className="absolute inset-0 flex items-center justify-center text-primary transition-opacity duration-200 group-hover:opacity-0">
          {scrollPercentage >= 99 ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-primary">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <Zap className="w-4 h-4 fill-primary/20 text-primary" />
          )}
        </div>
        
        {/* Hover Arrow Up */}
        <div className="absolute inset-0 flex items-center justify-center text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ArrowUp className="w-4 h-4 text-primary" strokeWidth={3} />
        </div>
      </button>
    </div>
  );
}
