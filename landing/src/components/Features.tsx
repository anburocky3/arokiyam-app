/* SVG icon components */
const icons = {
  activity: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  battery: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/>
      <rect x="4" y="9" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  shuffle: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>
    </svg>
  ),
  eye: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  droplet: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  coffee: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  target: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  zap: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  bell: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
};

const features = [
  { icon: icons.activity, title: 'Live Stress Monitoring', desc: 'Tracks stress levels using keyboard and mouse activity signals in real-time.', color: '#6366f1' },
  { icon: icons.battery, title: 'Health Battery Model', desc: 'A health battery drains during stress and recharges during breaks.', color: '#10b981' },
  { icon: icons.shuffle, title: 'Smart Randomized Breaks', desc: 'Break reminders are randomized to avoid reminder fatigue.', color: '#f59e0b' },
  { icon: icons.eye, title: 'Eye Blink Reminder', desc: 'Guided blink exercises reduce eye strain during long coding sessions.', color: '#22d3ee' },
  { icon: icons.droplet, title: 'Hydration Lock', desc: 'Water reminders help users stay hydrated throughout the day.', color: '#3b82f6' },
  { icon: icons.coffee, title: 'Focus Drink Activity', desc: 'Reminds users to drink coffee, tea, or juice for sustained focus.', color: '#a78bfa' },
  { icon: icons.target, title: 'Health Strictness Modes', desc: 'Choose from Basic, Medium, or Health Conscious strictness levels.', color: '#f43f5e', tags: ['Basic', 'Medium', 'Health Conscious'] },
  { icon: icons.zap, title: 'Manual Quick Actions', desc: 'Instantly trigger any wellness activity with one-click quick actions.', color: '#14b8a6', tags: ['Blink', 'Break', 'Hydration', 'Drink'] },
  { icon: icons.bell, title: 'Smart Notifications', desc: "Desktop reminders that don't interrupt your workflow.", color: '#f97316' },
];

export default function Features() {
  return (
    <section
      className="relative py-[100px] md:py-[80px]"
      style={{ background: 'var(--gradient-section)' }}
      id="features"
    >
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4 relative z-[1]">
        <div className="text-center mb-14 md:mb-9">
          <h2 className="section-title fade-in">Powerful Wellness Features for Developers</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] max-w-[580px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to maintain your health while staying productive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass-card feature-card fade-in fade-in-delay-${(i % 3) + 1} px-7 py-8 group`}
            >
              <div
                className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-[1.4rem] mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}33`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-[1.05rem] mb-[10px]" style={{ fontFamily: 'var(--font-heading)' }}>{f.title}</h3>
              <p className="text-[0.9rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              {f.tags && (
                <div className="flex flex-wrap gap-[6px] mt-3">
                  {f.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-[10px] py-1 rounded-[6px] text-[0.72rem] font-medium border"
                      style={{
                        background: 'var(--bg-glass)',
                        borderColor: 'var(--border-glass)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
