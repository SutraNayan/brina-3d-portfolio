import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Monitor, Fingerprint, Layout, Code2, ArrowRight, Sparkles } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Monitor,
    title: 'Website Design',
    description:
      'Creating stunning, responsive websites that captivate audiences and drive conversions. From concept to launch, I ensure every pixel serves a purpose.',
    color: '#00f5ff',
    features: ['Responsive Design', 'UI/UX Optimization', 'Performance Tuning'],
  },
  {
    icon: Fingerprint,
    title: 'Brand Identity',
    description:
      'Building memorable brand identities that resonate with your target audience. Logo design, color palettes, and comprehensive brand guidelines.',
    color: '#ff006e',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Systems'],
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description:
      'Crafting intuitive user experiences through research-driven design. Wireframes, prototypes, and user testing to ensure optimal usability.',
    color: '#ffbe0b',
    features: ['User Research', 'Prototyping', 'Usability Testing'],
  },
  {
    icon: Code2,
    title: 'Development',
    description:
      'Bringing designs to life with clean, efficient code. Full-stack development using modern frameworks and best practices.',
    color: '#8338ec',
    features: ['React/Next.js', 'Node.js', 'Database Design'],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.services-heading',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Service cards curtain rise
      gsap.fromTo(
        '.service-card',
        { scaleY: 0, transformOrigin: 'bottom' },
        {
          scaleY: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Icons spin in
      gsap.fromTo(
        '.service-icon',
        { rotation: 180, opacity: 0 },
        {
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden"
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)`
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'var(--color-cyan)' : 'var(--color-magenta)',
              opacity: 0.2,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm text-[var(--text-secondary)]">What I Offer</span>
          </div>
          <h2 className="services-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-[var(--font-display)] text-[var(--text-primary)]">
            My <span className="text-gradient">Services</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to elevate your brand and
            drive meaningful results.
          </p>
        </div>

        {/* Services Grid - Horizontal Accordion */}
        <div className="services-grid flex flex-col lg:flex-row gap-4 lg:gap-2 lg:h-[500px]">
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-card relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-expo ${
                activeIndex === index
                  ? 'lg:flex-[3] flex-auto'
                  : activeIndex !== null
                  ? 'lg:flex-[0.5] flex-auto'
                  : 'lg:flex-1 flex-auto'
              }`}
              style={{
                background: `linear-gradient(135deg, ${service.color}10 0%, ${service.color}05 100%)`,
                border: `1px solid ${service.color}30`,
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Content */}
              <div className="relative h-full p-6 lg:p-8 flex flex-col">
                {/* Icon */}
                <div
                  className="service-icon w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${service.color}20` }}
                >
                  <service.icon
                    className="w-7 h-7"
                    style={{ color: service.color }}
                  />
                </div>

                {/* Title - Always visible */}
                <h3
                  className={`text-xl lg:text-2xl font-bold mb-4 transition-all duration-500 ${
                    activeIndex === index ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {service.title}
                </h3>

                {/* Description - Visible on active */}
                <div
                  className={`flex-1 transition-all duration-500 ${
                    activeIndex === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 lg:opacity-0'
                  }`}
                >
                  <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: service.color }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="#footer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium group"
                    style={{ color: service.color }}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Number indicator */}
                <div
                  className="absolute top-6 right-6 text-6xl font-bold opacity-10 font-[var(--font-display)]"
                  style={{ color: service.color }}
                >
                  0{index + 1}
                </div>

                {/* Animated Border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    border: `2px solid ${service.color}`,
                    opacity: activeIndex === index ? 0.5 : 0,
                  }}
                />

                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${service.color}20 0%, transparent 70%)`,
                    opacity: activeIndex === index ? 1 : 0,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
