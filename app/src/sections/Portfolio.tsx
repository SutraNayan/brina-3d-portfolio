import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ArrowUpRight, Eye } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'Beyond',
    category: 'Web Design',
    image: '/images/portfolio-1.jpg',
    description: 'A minimalist portfolio website for a luxury glass art studio.',
    tags: ['React', 'Three.js', 'GSAP'],
    link: '#',
    github: '#',
    color: '#00f5ff',
  },
  {
    id: 2,
    title: 'SaaS Dashboard',
    category: 'Development',
    image: '/images/portfolio-2.jpg',
    description: 'Modern analytics dashboard with real-time data visualization.',
    tags: ['Next.js', 'TypeScript', 'D3.js'],
    link: '#',
    github: '#',
    color: '#ff006e',
  },
  {
    id: 3,
    title: 'Innovate',
    category: 'Brand Identity',
    image: '/images/portfolio-3.jpg',
    description: 'Complete brand overhaul for a tech startup.',
    tags: ['Branding', 'UI Design', 'Motion'],
    link: '#',
    github: '#',
    color: '#8338ec',
  },
  {
    id: 4,
    title: 'Pixel Perfect',
    category: 'UI/UX Design',
    image: '/images/portfolio-4.jpg',
    description: 'Elegant stationery design for an architecture firm.',
    tags: ['Print Design', 'Identity', 'Layout'],
    link: '#',
    github: '#',
    color: '#ffbe0b',
  },
  {
    id: 5,
    title: 'Craft',
    category: 'Development',
    image: '/images/portfolio-5.jpg',
    description: 'E-commerce platform with immersive product experiences.',
    tags: ['Shopify', 'Liquid', 'JavaScript'],
    link: '#',
    github: '#',
    color: '#00f5ff',
  },
  {
    id: 6,
    title: 'Spark Analytics',
    category: 'Web App',
    image: '/images/portfolio-6.jpg',
    description: 'Real-time business intelligence dashboard.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    link: '#',
    github: '#',
    color: '#ff006e',
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.portfolio-heading',
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

      // Grid items flip up
      gsap.fromTo(
        '.portfolio-item',
        { rotateX: 90, opacity: 0, transformOrigin: 'bottom' },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.portfolio-grid',
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
      id="portfolio"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--color-cyan)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-[var(--color-magenta)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <h2 className="portfolio-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-4 font-[var(--font-display)] text-[var(--text-primary)]">
              Selected <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl">
              A curated collection of projects that showcase my expertise in
              design and development.
            </p>
          </div>

          <a
            href="#"
            className="mt-6 lg:mt-0 inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        {/* Portfolio Grid */}
        <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`portfolio-item group relative preserve-3d ${
                index === 2 ? 'lg:row-span-2' : ''
              }`}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] transition-all duration-500 ${
                  index === 2 ? 'h-full min-h-[400px] lg:min-h-full' : 'aspect-[4/3]'
                }`}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Holographic Shine Effect */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-500 holographic ${
                    hoveredId === project.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* RGB Split Effect on Hover */}
                <div
                  className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
                    hoveredId === project.id ? 'rgb-split' : ''
                  }`}
                />

                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    hoveredId === project.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at center, ${project.color}30 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Category */}
                  <span 
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: project.color }}
                  >
                    {project.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-2 font-[var(--font-display)] text-[var(--text-primary)] group-hover:text-gradient transition-all duration-300">
                    {project.title}
                  </h3>

                  {/* Description - Shows on hover */}
                  <p
                    className={`text-sm text-[var(--text-secondary)] mb-4 transition-all duration-500 ${
                      hoveredId === project.id
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className={`px-3 py-1 text-xs rounded-full bg-[var(--bg-glass)] text-[var(--text-secondary)] transition-all duration-500 ${
                          hoveredId === project.id
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                        style={{ transitionDelay: `${tIndex * 50}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex items-center gap-4 transition-all duration-500 ${
                      hoveredId === project.id
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <a
                      href={project.link}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300"
                      style={{ 
                        background: project.color,
                        color: '#fff',
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Live Demo
                    </a>
                    <a
                      href={project.github}
                      className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium rounded-full hover:bg-[var(--bg-glass)] transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  </div>
                </div>

                {/* Corner Accent */}
                <div
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--bg-glass)] flex items-center justify-center transition-all duration-500 ${
                    hoveredId === project.id
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-75'
                  }`}
                >
                  <ArrowUpRight className="w-5 h-5 text-[var(--text-primary)]" />
                </div>

                {/* Index Number */}
                <div className="absolute top-4 left-4 text-6xl font-bold text-[var(--text-muted)]/20 font-[var(--font-display)]">
                  0{index + 1}
                </div>

                {/* Border Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
                    hoveredId === project.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    boxShadow: `0 0 30px ${project.color}40, inset 0 0 30px ${project.color}10`,
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
