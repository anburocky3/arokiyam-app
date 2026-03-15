import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiGithub } from 'react-icons/fi';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Preview', href: '#preview' },
    { label: 'Download', href: '#download' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('arokiyam-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      const sections = links.map(link => link.href.substring(1));
      let current = '';

      // Find the section that is currently most in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold - if the element is at least 30% into the viewport
          if (rect.top < window.innerHeight * 0.4 && rect.bottom > 200) {
            current = section;
          }
        }
      }

      // Special case: if at the bottom of the page, the last section wins
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
        current = sections[sections.length - 1];
      }

      // If at the very top, clear
      if (window.scrollY < 100) {
        setActiveSection('');
      } else {
        setActiveSection(current ? `#${current}` : '');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('arokiyam-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      {/* Always-on glassmorphism navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-1000 transition-all duration-300`}
        style={{
          padding: scrolled ? '10px 0' : '16px 0',
          background: 'var(--nav-bg)',
          backdropFilter: 'var(--backdrop-blur-heavy)',
          WebkitBackdropFilter: 'var(--backdrop-blur-heavy)',
          borderBottom: '1px solid var(--border-glass)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : '0 2px 12px rgba(0,0,0,0.10)',
        }}
      >
        {/* Clean glassmorphism nav content */}
        <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-[10px] font-bold text-[1.3rem]"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            <Image width={34} height={34} src="/logo.png" alt="Arokiyam" className="w-[34px] h-[34px] rounded-[10px] object-cover" />
            Arokiyam
          </a>

          <ul className="hidden md:flex items-center gap-8 list-none">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-[0.88rem] font-medium transition-all duration-300 hover:text-[var(--text-primary)]`}
                  style={{ color: activeSection === link.href ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {mounted ? (theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />) : <FiSun size={18} />}
            </button>
            <a
              href='https://github.com/anburocky3/arokiyam-app/fork'
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary navbar-cta-desktop hidden md:inline-flex items-center gap-2 py-[9px] px-5 rounded-xl font-semibold text-[0.82rem]"
            >
              <FiGithub size={16} />
              GitHub
            </a>
            <button
              className="hamburger md:hidden flex flex-col gap-[5px] bg-transparent p-1 w-[30px] h-[30px] justify-center items-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-[22px] h-[2px] rounded-sm transition-all duration-300 origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} style={{ background: 'var(--text-primary)' }}></span>
              <span className={`block w-[22px] h-[2px] rounded-sm transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: 'var(--text-primary)' }}></span>
              <span className={`block w-[22px] h-[2px] rounded-sm transition-all duration-300 origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} style={{ background: 'var(--text-primary)' }}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen glass menu */}
      <div
        className={`fixed inset-0 z-999 flex-col items-center justify-center gap-7 ${menuOpen ? 'flex' : 'hidden'}`}
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'var(--backdrop-blur-heavy)',
          WebkitBackdropFilter: 'var(--backdrop-blur-heavy)',
        }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[1.2rem] font-semibold"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
