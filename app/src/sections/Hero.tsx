import { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { ArrowDown, Sparkles, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';



// ========================================
// KINETIC TEXT COMPONENT
// ========================================
function KineticText({ text, className }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = containerRef.current?.querySelectorAll('.kinetic-char');
    if (chars) {
      gsap.fromTo(
        chars,
        { y: 100, opacity: 0, rotateX: 90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className={`perspective-1000 ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="kinetic-char inline-block preserve-3d"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

// ========================================
// MAIN HERO COMPONENT
// ========================================
export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtitle animation
      gsap.fromTo(
        '.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.2 }
      );

      // CTA animation
      gsap.fromTo(
        '.hero-cta',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 1.5,
        }
      );

      // Badge animation
      gsap.fromTo(
        '.hero-badge',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );

      // Scroll parallax for content
      gsap.to('.hero-content', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move handler for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollToWorks = () => {
    const portfolio = document.querySelector('#portfolio');
    if (portfolio) {
      portfolio.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Spline 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/6Tyrs0fKW-1Twia4/scene.splinecode" />
      </div>

      {/* Abstract Image Overlay */}
      <div className="absolute inset-0 z-[1] opacity-30 mix-blend-overlay pointer-events-none">
        <img
          src="/images/hero-abstract.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 15, 0.5) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, rgba(248, 249, 252, 0.5) 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex justify-center pointer-events-none">
        <div
          ref={contentRef}
          className="hero-content text-left perspective-1000 pointer-events-auto"
          style={{
            transform: `rotateX(${mousePosition.y * -2}deg) rotateY(${mousePosition.x * 2}deg)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {/* Glass Card */}
          <div className="glass rounded-3xl p-4 md:p-8 lg:p-12 max-w-2xl lg:max-w-4xl mx-auto drop-shadow-lg text-center backdrop-blur-md glow-cyan bg-gradient-to-b from-[var(--color-cyan)]/5 to-transparent border-[var(--color-cyan)]/20">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-cyan)]/10 border border-[var(--color-cyan)]/30 mb-8">
              <Sparkles className="w-4 h-4 text-[var(--color-cyan)]" />
              <span className="text-sm text-[var(--text-secondary)]">Available for freelance work</span>
            </div>

            {/* Title with Kinetic Typography */}
            <KineticText
              text="I'm BriNa"
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-[var(--font-display)] text-[var(--text-primary)]"
            />

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-[var(--text-secondary)] mb-4 font-light relative inline-block">
              a{' '}
              <span className="text-gradient font-medium relative z-10">
                Creative Developer
              </span>
              {/* Hand-Drawn SVG Underline */}
              <svg className="absolute -bottom-2 md:-bottom-3 left-6 w-full h-4 md:h-6 text-[var(--color-cyan)] opacity-70 z-0 pointer-events-none" viewBox="0 0 200 20" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 15Q50 5 100 12T195 8" />
                <path d="M15 18Q60 8 110 15T185 12" opacity="0.5" />
              </svg>
            </p>

            <p className="hero-subtitle text-base md:text-lg text-[var(--text-tertiary)] max-w-xl mx-auto mb-10 drop-shadow-md">
              Crafting immersive digital experiences through the fusion of design
              and cutting-edge technology.
            </p>

            {/* CTA Buttons - Pushed down slightly to give the robot space */}
            <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={handleScrollToWorks}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-magenta)] text-white font-medium rounded-full hover:scale-105 transition-all duration-300 glow-cyan"
              >
                Explore Works
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#footer"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-3 px-8 py-4 border border-[var(--border-color)] text-[var(--text-primary)] font-medium rounded-full hover:bg-[var(--bg-glass)] transition-all duration-300"
              >
                Get in Touch
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-[var(--color-cyan)]/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[var(--color-cyan)] rounded-full animate-bounce" />
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-[var(--color-cyan)]/20 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 border border-[var(--color-magenta)]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
}
