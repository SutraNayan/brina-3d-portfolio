import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Globe, Zap, Brain, AppWindow, Terminal, Building2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { icon: Terminal, label: 'Prompt Engineering', value: '98%', color: '#b40101' }, // KW Red
  { icon: AppWindow, label: 'WebApp Dev', value: '95%', color: '#cf142b' }, // Light Red
  { icon: Brain, label: 'AI Integration', value: '92%', color: '#f1f1f1' }, // Silver
  { icon: Building2, label: 'Real Estate Strategy', value: '88%', color: '#111111' }, // Charcoal
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background text parallax
      gsap.to('.about-bg-text', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Image reveal with circle mask
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
        {
          clipPath: 'circle(100% at 50% 50%)',
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image 3D rotation on scroll
      gsap.fromTo(
        imageRef.current,
        { rotateY: -15 },
        {
          rotateY: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Heading animation
      gsap.fromTo(
        '.about-heading',
        { x: -100, skewX: 20, opacity: 0 },
        {
          x: 0,
          skewX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Body text stagger
      gsap.fromTo(
        '.about-text',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Skill bars
      gsap.fromTo(
        '.skill-bar',
        { width: '0%' },
        {
          width: (_i, el) => el.dataset.value,
          duration: 1.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden"
    >
      {/* Abstract Background Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/images/about-abstract.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 50%, var(--bg-primary) 100%)'
              : 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 50%, var(--bg-primary) 100%)'
          }}
        />
      </div>

      {/* Background Text */}
      <div className="about-bg-text absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-[var(--font-display)] font-bold text-stroke whitespace-nowrap pointer-events-none select-none z-0">
        ABOUT
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--color-cyan)]/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div
            ref={imageRef}
            className="relative perspective-1000"
          >
            {/* Hand-Drawn SVG Accent Behind Image */}
            <svg className="absolute -top-10 -left-10 w-32 h-32 text-[var(--color-magenta)] opacity-30 z-0 pointer-events-none animate-spin" style={{ animationDuration: '40s' }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 5 L55 35 L85 40 L60 60 L70 90 L50 75 L30 90 L40 60 L15 40 L45 35 Z" strokeLinejoin="round" />
            </svg>

            <div className="relative aspect-[3/4] organic-border overflow-hidden animate-float bg-[var(--bg-secondary)]">
              <img
                src="/images/about-abstract.jpg"
                alt="Abstract Network"
                className="w-full h-full object-cover mix-blend-overlay opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/90 to-transparent" />

              {/* Holographic Overlay */}
              <div className="absolute inset-0 holographic" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-6 animate-pulse-glow">
              <div className="text-4xl font-bold text-gradient">12+</div>
              <div className="text-sm text-[var(--text-secondary)]">Years Experience</div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-[var(--color-cyan)]/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[var(--color-magenta)]/10 rounded-full blur-xl" />
            <div className="absolute top-1/2 -right-4 w-3 h-3 bg-[var(--color-gold)] rounded-full animate-pulse" />
          </div>

          {/* Content Column */}
          <div ref={contentRef} className="relative">
            {/* Hand-Drawn Arrow Pointing to Title */}
            <svg className="absolute -top-12 right-0 w-24 h-24 text-[var(--color-cyan)] opacity-50 z-0 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M80 20 Q50 10 20 40 T10 80" />
              <path d="M10 80 L25 75 M10 80 L15 65" />
            </svg>

            <h2 className="about-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-[var(--font-display)] text-[var(--text-primary)] relative z-10">
              About <span className="text-gradient">Me</span>
            </h2>

            <div className="space-y-6 mb-10">
              <p className="about-text text-lg text-[var(--text-secondary)] leading-relaxed">
                I'm a passionate creative developer based in San Francisco,
                dedicated to crafting digital experiences that push the boundaries
                of what's possible on the web. With over a decade of experience,
                I've had the privilege of working with startups and Fortune 500
                companies alike.
              </p>

              <p className="about-text text-lg text-[var(--text-tertiary)] leading-relaxed">
                My approach combines technical expertise with an artistic vision,
                ensuring every project not only functions flawlessly but also
                tells a compelling story. I believe in the power of thoughtful
                design and clean code to transform ideas into reality.
              </p>

              <p className="about-text text-lg text-[var(--text-tertiary)] leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies,
                contributing to open-source projects, or capturing moments through
                my vintage film camera.
              </p>
            </div>

            {/* Signature */}
            <div className="about-text mb-10">
              <p className="font-[var(--font-display)] text-2xl italic text-[var(--text-muted)]">
                BriNa
              </p>
            </div>

            {/* Skills */}
            <div className="skills-container space-y-5">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${skill.color}20` }}
                      >
                        <skill.icon className="w-5 h-5" style={{ color: skill.color }} />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">{skill.label}</span>
                    </div>
                    <span className="text-sm text-[var(--text-tertiary)]">{skill.value}</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="skill-bar h-full rounded-full transition-all duration-1000"
                      style={{
                        background: `linear-gradient(to right, ${skill.color}, ${skill.color}80)`,
                      }}
                      data-value={skill.value}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: Zap, value: '150+', label: 'Projects' },
                { icon: Award, value: '25+', label: 'Awards' },
                { icon: Globe, value: '40+', label: 'Clients' },
              ].map((stat, index) => (
                <div key={index} className="glass rounded-xl p-4 text-center hover:bg-[var(--bg-glass-hover)] transition-colors">
                  <stat.icon className="w-5 h-5 text-[var(--color-cyan)] mx-auto mb-2" />
                  <div className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                  <div className="text-xs text-[var(--text-tertiary)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
