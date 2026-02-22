import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotation: 0, scale: 0.8 },
        { rotation: theme === 'dark' ? 0 : 180, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [theme]);

  const handleClick = () => {
    // Ripple effect
    if (buttonRef.current) {
      const ripple = document.createElement('span');
      ripple.className = 'absolute inset-0 rounded-full bg-current opacity-20 animate-ping';
      buttonRef.current.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    toggleTheme();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="relative w-12 h-12 rounded-full glass flex items-center justify-center overflow-hidden group hover:scale-110 transition-transform duration-300"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          theme === 'dark' ? 'bg-[#F5A623]/20' : 'bg-[#4A90E2]/20'
        }`}
      />
      
      <div ref={iconRef} className="relative z-10">
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-[#F5A623]" />
        ) : (
          <Sun className="w-5 h-5 text-[#4A90E2]" />
        )}
      </div>
      
      {/* Holographic border */}
      <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" />
    </button>
  );
}
