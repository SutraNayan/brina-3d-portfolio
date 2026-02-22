import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const clients = [
  { name: 'Spotify', initials: 'SP' },
  { name: 'Netflix', initials: 'NF' },
  { name: 'Airbnb', initials: 'AB' },
  { name: 'Slack', initials: 'SL' },
  { name: 'Stripe', initials: 'ST' },
  { name: 'Figma', initials: 'FG' },
];

export default function Clients() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.clients-heading',
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

      // Logo cards pop in
      gsap.fromTo(
        '.client-card',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.clients-grid',
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
      id="clients"
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="clients-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-[var(--font-display)] text-[var(--text-primary)]">
            Trusted By <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Proud to have collaborated with some of the world's most innovative
            companies.
          </p>
        </div>

        {/* Clients Grid */}
        <div className="clients-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {clients.map((client, index) => (
            <div
              key={index}
              className="client-card group relative"
            >
              <div className="relative aspect-square rounded-2xl glass flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-105">
                {/* Holographic Shine Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                    backgroundSize: '200% 200%',
                    animation: 'shimmer 2s infinite',
                  }}
                />

                {/* Logo Placeholder */}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-2xl font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors duration-300">
                    {client.initials}
                  </div>
                </div>

                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cyan)]/10 to-[var(--color-magenta)]/10" />
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-[var(--color-cyan)]/30" />
              </div>

              {/* Client Name */}
              <p className="text-center text-sm text-[var(--text-muted)] mt-3 group-hover:text-[var(--text-secondary)] transition-colors">
                {client.name}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '50+', label: 'Global Clients' },
            { value: '12', label: 'Countries' },
            { value: '99%', label: 'Retention Rate' },
            { value: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
