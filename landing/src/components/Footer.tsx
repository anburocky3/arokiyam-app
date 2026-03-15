export default function Footer() {
  return (
    <footer
      className="border-t pt-12 pb-8"
      style={{ borderColor: 'var(--border-glass)' }}
      id="footer"
    >
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4">
        {/* Content row */}
        <div className="flex justify-between items-start gap-10 xl:gap-16 2xl:gap-24 mb-10 max-[768px]:flex-col">
          {/* Brand */}
          <div className="max-w-[320px]">
            <div
              className="flex items-center gap-[10px] font-bold text-[1.3rem] mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
            >
              <img src="/logo.png" alt="Arokiyam" className="w-8 h-8 rounded-[8px] object-cover" />
              Arokiyam
            </div>
            <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Your intelligent desktop wellness companion.
              Built for developers, by developers.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 max-[768px]:gap-8 flex-wrap">
            <div>
              <h4
                className="font-semibold text-[0.85rem] uppercase tracking-[0.05em] mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}
              >
                Product
              </h4>
              <ul className="flex flex-col gap-[10px] list-none">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'Downloads', href: '#download' },
                  { label: 'Preview', href: '#preview' },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-[0.85rem] transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                className="font-semibold text-[0.85rem] uppercase tracking-[0.05em] mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}
              >
                Resources
              </h4>
              <ul className="flex flex-col gap-[10px] list-none">
                {[
                  { label: 'GitHub', href: 'https://github.com/anburocky3/arokiyam-app', external: true },
                  { label: 'Documentation', href: 'https://github.com/anburocky3/arokiyam-app#readme', external: true },
                  { label: 'License (MIT)', href: 'https://github.com/anburocky3/arokiyam-app/blob/main/LICENSE', external: true },
                ].map(({ label, href, external }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="text-[0.85rem] transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex justify-between items-center flex-wrap gap-3 max-[768px]:flex-col max-[768px]:text-center"
          style={{ borderColor: 'var(--border-glass)' }}
        >
          <p className="text-[0.8rem]" style={{ color: 'var(--text-muted)' }}>
            App by{' '}
            <a
              href="https://github.com/anburocky3"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Anbuselvan Annamalai
            </a>
            {' • '}
            Landing by{' '}
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Gokulakrishnan A
            </span>
            {' & '}
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Saranmuthukumar K
            </span>
          </p>
          <p className="text-[0.8rem]" style={{ color: 'var(--text-muted)' }}>All Rights Reserved © 2026</p>
        </div>
      </div>
    </footer>
  );
}
