import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Liam Anderson',
    role: 'CEO, TechVentures',
    image: '/images/testimonial-1.jpg',
    content:
      'James transformed our vision into reality. His attention to detail and creative approach exceeded our expectations. The website he built has significantly improved our conversion rates.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Emma Richardson',
    role: 'Marketing Director, Bloom Co',
    image: '/images/testimonial-2.jpg',
    content:
      'Working with James was an absolute pleasure. He understood our brand identity perfectly and delivered a stunning website that truly represents who we are. Highly recommended!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Noah Mitchell',
    role: 'Founder, StartupHub',
    image: '/images/testimonial-3.jpg',
    content:
      'The level of professionalism and creativity James brings to every project is unmatched. Our new platform has received incredible feedback from users and stakeholders alike.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Ava Thompson',
    role: 'Creative Director, Artisan Labs',
    image: '/images/testimonial-4.jpg',
    content:
      'James has an exceptional ability to blend aesthetics with functionality. The e-commerce site he created for us is not only beautiful but also incredibly user-friendly.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Olivia Parker',
    role: 'Product Manager, InnovateTech',
    image: '/images/testimonial-5.jpg',
    content:
      'From concept to launch, James was a true partner. His technical expertise and design sensibility made our product launch a huge success. We continue to work together on new projects.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Sophia Williams',
    role: 'CEO, DesignStudio',
    image: '/images/testimonial-6.jpg',
    content:
      'James delivered beyond our expectations. His innovative approach to our dashboard design has made complex data accessible and engaging for our users.',
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.testimonials-heading',
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

      // Cards Hanging and Swinging
      gsap.fromTo(
        '.testimonial-carousel',
        {
          rotation: (index) => (index % 2 === 0 ? 15 : -15), // Initial off-balance state
          transformOrigin: "top center",
          opacity: 0,
          y: -50
        },
        {
          rotation: (index) => (index % 2 === 0 ? 3 : -2), // Settle into slight organic tilt
          opacity: 1,
          y: 0,
          duration: 2.5,
          ease: "elastic.out(1, 0.3)", // Bouncy physics effect
          stagger: 0.2, // Drop in one by one
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-cyan)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="testimonials-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-[var(--font-display)] text-[var(--text-primary)]">
            Client <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say
            about working together.
          </p>
        </div>

        {/* Hanging Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative pt-10">
          {/* Top structural "beam" for visual anchoring */}
          <div className="absolute top-0 left-4 right-4 h-2 bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent opacity-50 z-0"></div>

          {testimonials.map((testimonial, index) => {
            // Calculate staggered hanging lengths and rotations for organic feel
            const stringLength = 40 + (index % 3) * 30; // 40px, 70px, or 100px
            const rotateOffset = index % 2 === 0 ? 3 : -2; // slight organic tilt

            return (
              <div
                key={testimonial.id}
                className="testimonial-carousel relative flex flex-col items-center"
                style={{
                  marginTop: `${stringLength}px`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Hand-Drawn Hanging String */}
                <svg className="absolute -top-[100px] w-4 h-[100px] text-[var(--border-hover)] z-0" style={{ height: `${stringLength + 20}px`, top: `-${stringLength + 20}px` }} preserveAspectRatio="none" viewBox="0 0 10 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={`M5 0 Q${index % 2 === 0 ? '8' : '2'} 50 5 100`} />
                </svg>

                {/* The Paper Card */}
                <div
                  className="organic-border bg-[var(--bg-secondary)] p-8 relative hover:rotate-0 transition-transform duration-500 hover:-translate-y-2 z-10 shadow-card"
                  style={{ transform: `rotate(${rotateOffset}deg)` }}
                >
                  {/* Pin (tape/tack) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-cyan)] shadow-glow z-20"></div>

                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-5">
                    <Quote className="w-12 h-12 text-[var(--text-primary)]" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[var(--color-cyan)] text-[var(--color-cyan)]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg text-[var(--text-primary)] leading-relaxed mb-8 font-light italic">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Hand-Drawn Divider */}
                    <svg className="w-full h-2 mb-6 text-[var(--border-color)]" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M0 5 Q25 0 50 5 T100 5" />
                    </svg>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 organic-border-alt overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-80"
                        />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[var(--text-primary)]">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
