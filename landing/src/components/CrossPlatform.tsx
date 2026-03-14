const WindowsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const LinuxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.504 0c-.155 0-.311.015-.466.047-3.05.656-4.55 3.083-5.448 5.549a119.3 119.3 0 0 0-.717 2.166c-.253-.182-.519-.321-.791-.421-.614-.227-1.21-.256-1.743-.128-.998.242-1.772 1.003-2.179 2.125-.407 1.125-.483 2.567-.093 4.18.78 3.222 3.053 5.832 5.576 7.473.628.41 1.268.755 1.894 1.013.32.13.634.23.938.295l.095-.058c.29-.186.585-.387.881-.601.67-.481 1.351-1.027 2.022-1.632.66-.596 1.324-1.25 1.974-1.955 1.281-1.392 2.548-3.026 3.587-4.863 1.06-1.875 1.871-3.975 2.209-6.235.169-1.13.185-2.3-.024-3.41-.21-1.112-.65-2.164-1.373-2.974a4.916 4.916 0 0 0-2.67-1.495A5.463 5.463 0 0 0 12.504 0z"/>
  </svg>
);

const platforms = [
  { name: 'Windows', icon: <WindowsIcon />, desc: 'Windows 10 & 11', color: '#0078d4' },
  { name: 'macOS', icon: <AppleIcon />, desc: 'macOS 12+', color: '#a3aaae' },
  { name: 'Linux', icon: <LinuxIcon />, desc: 'Ubuntu, Debian & more', color: '#f59e0b' },
];

export default function CrossPlatform() {
  return (
    <section
      className="relative py-[100px] md:py-[80px]"
      style={{ background: 'var(--gradient-section)' }}
      id="cross-platform"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 md:mb-9">
          <h2 className="section-title fade-in">Works Everywhere</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] max-w-[580px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Arokiyam runs natively on all major desktop platforms
          </p>
        </div>

        <div className="grid grid-cols-3 max-[600px]:grid-cols-1 gap-6 max-w-[800px] mx-auto max-[600px]:max-w-[320px]">
          {platforms.map((p, i) => (
            <div
              key={p.name}
              className={`glass-card platform-card fade-in fade-in-delay-${i + 1} px-7 py-10 text-center group`}
            >
              <span
                className="text-[2.5rem] mb-4 block transition-all duration-300 group-hover:scale-[1.15]"
                style={{ color: p.color }}
              >
                {p.icon}
              </span>
              <h3 className="font-semibold text-[1.1rem] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{p.name}</h3>
              <p className="text-[0.85rem]" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <p className="fade-in text-center mt-8 text-[0.95rem]" style={{ color: 'var(--text-secondary)' }}>
          Download once, enjoy the same great experience across all your devices.
        </p>
      </div>
    </section>
  );
}
