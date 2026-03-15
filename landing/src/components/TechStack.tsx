const techs = [
  { name: 'Electron', desc: 'Cross-platform desktop framework', icon: '⚛️', color: '#47848f' },
  { name: 'React', desc: 'Component-based UI library', icon: '⚛️', color: '#61dafb' },
  { name: 'TypeScript', desc: 'Type-safe JavaScript', icon: '🔷', color: '#3178c6' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS framework', icon: '🎨', color: '#38bdf8' },
  { name: 'uiohook-napi', desc: 'Keyboard & mouse monitoring', icon: '⌨️', color: '#f59e0b' },
  { name: 'electron-builder', desc: 'Desktop packaging & distribution', icon: '📦', color: '#a78bfa' },
];

export default function TechStack() {
  return (
    <section className="relative py-[100px] md:py-[80px]" id="tech-stack">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 md:mb-9">
          <h2 className="section-title fade-in">Built with Modern Technology</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] max-w-[580px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Powered by the best tools in the ecosystem
          </p>
        </div>

        <div className="grid grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1 gap-5">
          {techs.map((t, i) => (
            <div
              key={t.name}
              className={`glass-card tech-card fade-in fade-in-delay-${(i % 3) + 1} px-6 py-7 text-center group`}
            >
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-[14px] flex items-center justify-center text-[1.6rem] border transition-all duration-300 group-hover:scale-[1.15]"
                style={{
                  background: `${t.color}18`,
                  border: `1px solid ${t.color}33`,
                }}
              >
                {t.icon}
              </div>
              <h3 className="font-semibold text-[1rem] mb-[6px]" style={{ fontFamily: 'var(--font-heading)' }}>{t.name}</h3>
              <p className="text-[0.82rem] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
