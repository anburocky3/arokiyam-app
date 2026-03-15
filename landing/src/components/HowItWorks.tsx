import { FiActivity, FiTrendingUp, FiBattery, FiZap, FiLayers } from 'react-icons/fi';

const steps = [
  { icon: <FiActivity size={22} />, title: 'Activity Monitoring', desc: 'Arokiyam monitors keyboard and mouse activity in real-time.', color: '#6366f1' },
  { icon: <FiTrendingUp size={22} />, title: 'Stress Pattern Analysis', desc: 'It analyzes activity stress patterns to understand your work intensity.', color: '#22d3ee' },
  { icon: <FiBattery size={22} />, title: 'Health Battery Drains', desc: 'A health battery drains during continuous work without breaks.', color: '#f43f5e' },
  { icon: <FiZap size={22} />, title: 'Wellness Triggers', desc: 'Wellness activities trigger automatically when stress increases.', color: '#10b981' },
  { icon: <FiLayers size={22} />, title: 'Guided Overlays', desc: 'Overlays guide users to blink, hydrate, and reset energy levels.', color: '#f59e0b' },
];

export default function HowItWorks() {
  return (
    <section className="relative py-[50px] md:py-[80px]" id="how-it-works" style={{ scrollMarginTop: '100px' }}>
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4">
        <div className="text-center mb-14 md:mb-9">
          <h2 className="section-title fade-in">How It Works</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] max-w-[580px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Arokiyam intelligently protects your health while you work
          </p>
        </div>

        <div className="grid grid-cols-5 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1 gap-5">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`fade-in fade-in-delay-${Math.min(i + 1, 5)} backdrop-blur-md border rounded-2xl px-[22px] py-7 relative text-center transition-all duration-300 group`}
              style={{
                background: 'var(--bg-glass)',
                borderColor: 'var(--border-glass)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-glass-hover)';
                e.currentTarget.style.borderColor = 'var(--border-glass-hover)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-glass)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.transform = '';
              }}
            >
              <span
                className="absolute top-3 right-[14px] font-bold text-[0.7rem] opacity-50 tracking-[0.05em]"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-muted)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-[18px] transition-all duration-300 group-hover:scale-110"
                style={{
                  color: step.color,
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}30`,
                }}
              >
                {step.icon}
              </div>
              <h3 className="font-semibold text-[0.92rem] mb-2 leading-[1.3]" style={{ fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
              <p className="text-[0.82rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
