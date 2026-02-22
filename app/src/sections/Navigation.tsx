import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import ThemeToggle from '../components/ThemeToggle';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#footer' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(
        '.mobile-nav-link',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-expo ${
          isScrolled ? 'py-3' : 'py-6'
        }`}
      >
        <div
          className={`mx-auto px-6 lg:px-12 transition-all duration-500 ${
            isScrolled ? 'max-w-6xl' : 'max-w-7xl'
          }`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              isScrolled ? 'glass rounded-full px-6 py-3' : ''
            }`}
          >
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="text-xl font-bold tracking-tight group"
            >
              <span className="font-[var(--font-display)] text-[var(--text-primary)]">BriNa</span>
              <span className="text-gradient">.</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-magenta)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* CTA Button */}
              <a
                href="#footer"
                onClick={(e) => handleNavClick(e, '#footer')}
                className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-magenta)] text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity duration-300"
              >
                Let's Talk
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[var(--text-primary)]"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--bg-primary)] transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="mobile-nav-link text-3xl font-[var(--font-display)] text-[var(--text-primary)] hover:text-gradient transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
