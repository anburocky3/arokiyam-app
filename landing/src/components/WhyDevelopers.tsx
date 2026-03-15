const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const DropletOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" opacity="0.4"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const DropletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);
const BatteryLowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/>
  </svg>
);
const BatteryFullIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/>
    <rect x="4" y="9" width="11" height="6" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const rows = [
  { problem: 'Eye strain from long screen time', solution: 'Blink reminder overlays', pIcon: <EyeOffIcon />, sIcon: <EyeIcon /> },
  { problem: 'Dehydration during deep work', solution: 'Smart water reminders', pIcon: <DropletOffIcon />, sIcon: <DropletIcon /> },
  { problem: 'Mental and physical fatigue', solution: 'Health battery system', pIcon: <BatteryLowIcon />, sIcon: <BatteryFullIcon /> },
  { problem: 'Overworking without breaks', solution: 'Smart break alerts', pIcon: <ClockIcon />, sIcon: <ZapIcon /> },
];

export default function WhyDevelopers() {
  return (
    <section
      className="relative py-[100px] md:py-[80px]"
      style={{ background: 'var(--gradient-section)' }}
      id="why-developers"
    >
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4">
        <div className="text-center mb-14 md:mb-9">
          <h2 className="section-title fade-in">Why Developers Love Arokiyam</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] max-w-[580px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Real problems meet intelligent solutions
          </p>
        </div>

        <div className="comparison-grid fade-in fade-in-delay-2 max-w-[800px] mx-auto">
          {/* Header */}
          <div className="md:grid hidden gap-0 mb-4" style={{ gridTemplateColumns: '1fr 48px 1fr' }}>
            <span
              className="font-semibold text-[0.9rem] uppercase tracking-[0.06em] px-5 py-3 text-center max-[600px]:hidden"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-rose)' }}
            >
              ❌ Problem
            </span>
            <span className="max-[600px]:hidden" />
            <span
              className="font-semibold text-[0.9rem] uppercase tracking-[0.06em] px-5 py-3 text-center max-[600px]:hidden"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-green)' }}
            >
              ✅ Solution
            </span>
          </div>

          {rows.map((row, i) => (
            <div
              key={i}
              className={`comparison-row fade-in fade-in-delay-${Math.min(i + 1, 5)} grid max-[600px]:grid-cols-1 md:grid-cols-[1fr_48px_1fr] mb-3 gap-2`}
            >
              <div
                className="comparison-problem flex flex-col min-[450px]:flex-row items-center gap-2 min-[450px]:gap-3 px-4 min-[450px]:px-[22px] py-3 min-[450px]:py-[18px] rounded-[10px] text-[0.85rem] min-[450px]:text-[0.92rem] font-medium border text-center min-[450px]:text-left w-full"
                style={{
                  background: 'rgba(244, 63, 94, 0.06)',
                  borderColor: 'rgba(244, 63, 94, 0.15)',
                  color: 'var(--text-secondary)',
                  wordBreak: 'break-word'
                }}
              >
                <span className="text-[1.1rem] shrink-0">{row.pIcon}</span>
                {row.problem}
              </div>
              <div className="comparison-arrow flex items-center justify-center text-[1.2rem] max-[600px]:hidden" style={{ color: 'var(--text-muted)' }}>→</div>
              <div
                className="comparison-solution flex flex-col min-[450px]:flex-row items-center gap-2 min-[450px]:gap-3 px-4 min-[450px]:px-[22px] py-3 min-[450px]:py-[18px] rounded-[10px] text-[0.85rem] min-[450px]:text-[0.92rem] font-medium border text-center min-[450px]:text-left w-full"
                style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  borderColor: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-word'
                }}
              >
                <span className="text-[1.1rem] shrink-0">{row.sIcon}</span>
                {row.solution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
