import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, ArrowUpRight, User, Sparkles } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

const posts = [
  {
    id: 1,
    title: 'The Future of Web Design: Trends to Watch in 2024',
    excerpt:
      'Exploring the cutting-edge technologies and design patterns shaping the future of digital experiences.',
    image: '/images/blog-1.jpg',
    author: 'James Warner',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
    category: 'Design',
    color: '#00f5ff',
  },
  {
    id: 2,
    title: 'Mastering Three.js: Creating Immersive 3D Experiences',
    excerpt:
      'A comprehensive guide to building stunning 3D web applications with Three.js and React.',
    image: '/images/blog-2.jpg',
    author: 'James Warner',
    date: 'Dec 10, 2024',
    readTime: '8 min read',
    category: 'Development',
    color: '#ff006e',
  },
  {
    id: 3,
    title: 'Design Systems: Building Consistency at Scale',
    excerpt:
      'How to create and maintain design systems that improve team efficiency and product consistency.',
    image: '/images/blog-3.jpg',
    author: 'James Warner',
    date: 'Dec 5, 2024',
    readTime: '6 min read',
    category: 'UX Design',
    color: '#8338ec',
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.blog-heading',
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

      // Blog cards entrance
      gsap.fromTo(
        '.blog-card',
        { y: 60, opacity: 0, rotateZ: -3 },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.blog-grid',
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
      id="blog"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-magenta)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="text-sm text-[var(--text-secondary)]">Latest Insights</span>
            </div>
            <h2 className="blog-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-[var(--font-display)] text-[var(--text-primary)]">
              Latest <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl">
              Thoughts on design, development, and the creative process.
            </p>
          </div>

          <a
            href="#"
            className="mt-6 lg:mt-0 inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            View All Posts
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        {/* Blog Grid - Magazine Spread Layout */}
        <div className="blog-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className={`blog-card group relative ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                transform:
                  hoveredId === post.id
                    ? 'translateY(-8px) rotate(0deg)'
                    : hoveredId !== null
                    ? `translateY(4px) rotate(${index % 2 === 0 ? 1 : -1}deg)`
                    : `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: hoveredId === post.id ? 10 : 1,
              }}
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] transition-all duration-500 ${
                  index === 0 ? 'h-full min-h-[500px]' : 'aspect-[4/3]'
                }`}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent" />
                </div>

                {/* Holographic Overlay */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-500 holographic ${
                    hoveredId === post.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    hoveredId === post.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at center, ${post.color}30 0%, transparent 70%)`,
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                  {/* Category */}
                  <span 
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs w-fit mb-4"
                    style={{ 
                      background: `${post.color}20`,
                      color: post.color,
                    }}
                  >
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3
                    className={`font-bold mb-3 font-[var(--font-display)] text-[var(--text-primary)] group-hover:text-gradient transition-all duration-300 ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                    }`}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    className={`text-[var(--text-secondary)] mb-4 line-clamp-2 ${
                      index === 0 ? 'text-base lg:text-lg' : 'text-sm'
                    }`}
                  >
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-[var(--color-cyan)]/20 to-[var(--color-magenta)]/20 transition-opacity duration-500 ${
                    hoveredId === post.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Read More Button */}
                <div
                  className={`absolute top-4 right-4 transition-all duration-500 ${
                    hoveredId === post.id
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-4'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: post.color }}
                  >
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Border Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
                    hoveredId === post.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    boxShadow: `0 0 30px ${post.color}40`,
                  }}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 glass rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 font-[var(--font-display)] text-[var(--text-primary)]">
            Stay Updated
          </h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Subscribe to my newsletter for the latest insights on design and
            development.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-cyan)] transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-magenta)] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
