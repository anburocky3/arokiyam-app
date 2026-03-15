import { FiDownload } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';

export default function CallToAction() {
  return (
    <section
      className="relative overflow-hidden py-[120px] md:py-[100px] flex items-center justify-center min-h-[60vh]"
      id="cta"
      aria-labelledby="cta-heading"
    >
      {/* Dynamic CTA Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"
        style={{ background: 'var(--accent-primary)' }}
        aria-hidden="true"
      ></div>

      {/* Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[rgba(99,102,241,0.1)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[rgba(99,102,241,0.05)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[rgba(99,102,241,0.02)]"></div>
      </div>

      <div className="w-full max-w-[1200px]  xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4 relative z-[1] text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div
          className="fade-in inline-flex bg-white/80 shadow-lg shadow-purple-500/20 items-center justify-center px-4 py-1.5 rounded-full text-[0.85rem] font-semibold tracking-wide uppercase mb-6"
          style={{
            color: 'var(--accent-primary)',
            border: '1px solid rgba(99,102,241,0.2)'
          }}
        >
          Start Today
        </div>

        {/* Heading */}
        <h2
          id="cta-heading"
          className="fade-in fade-in-delay-1 font-bold mb-6 leading-[1.2]"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          Start Building <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'var(--gradient-primary)' }}
          >
            Healthier
          </span>
          <br />Work Habits Today
        </h2>

        {/* Description */}
        <p
          className="fade-in fade-in-delay-2 text-[1.1rem] md:text-[1.2rem] max-w-[600px] mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Let Arokiyam protect your health while you focus on building great software.
        </p>

        {/* Buttons */}
        <div className="fade-in fade-in-delay-3 flex items-center justify-center gap-4 flex-wrap w-full mb-8">
          <a
            href="#download"
            className="btn btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-[1rem] shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform"
          >
            <FiDownload size={20} />
            Download Arokiyam
          </a>
          <a
            href="https://github.com/anburocky3/arokiyam-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-[1rem] transition-all hover:scale-105"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              backdropFilter: 'var(--backdrop-blur)'
            }}
          >
            ⭐ Star on GitHub
          </a>
        </div>


      </div>
    </section>
  );
}
