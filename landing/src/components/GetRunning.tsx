export default function GetRunning() {
  return (
    <section className="relative py-[100px] md:py-[80px]" id="get-running">
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4">
        <div className="w-full max-w-[800px] xl:max-w-[1000px] mx-auto">
          <div
            className="get-running-card glass-card fade-in p-10 md:p-6"
          >
            <h2
              className="mb-2"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: 'var(--text-primary)' }}
            >
              Get Running in Minutes
            </h2>
            <p className="text-[0.9rem] mb-7 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Built on Bun for blazing-fast installs and a familiar developer workflow from day one.
            </p>

            <div className="terminal rounded-xl overflow-hidden border" style={{ background: '#0d1117', borderColor: 'rgba(255,255,255,0.06)' }}>
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-[18px] py-[14px] border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>
              {/* Terminal body */}
              <div
                className="px-[22px] py-5 md:text-[0.72rem] md:px-4 text-[0.82rem] leading-[1.9]"
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace",
                  color: '#e6edf3',
                }}
              >
                <div style={{ color: '#6e7681' }}># Clone and install</div>
                <div>
                  <span style={{ color: '#7ee787', marginRight: 6 }}>$</span>
                  <span style={{ color: '#79c0ff' }}>git clone</span>{' '}
                  <span style={{ color: '#e6edf3' }}>github.com/anburocky3/arokiyam-app</span>
                </div>
                <div>
                  <span style={{ color: '#7ee787', marginRight: 6 }}>$</span>
                  <span style={{ color: '#79c0ff' }}>bun install</span>
                </div>

                <div className="h-4" />

                <div style={{ color: '#6e7681' }}># Start development</div>
                <div>
                  <span style={{ color: '#7ee787', marginRight: 6 }}>$</span>
                  <span style={{ color: '#79c0ff' }}>bun run dev</span>
                </div>

                <div className="h-4" />

                <div style={{ color: '#6e7681' }}># Build for your platform</div>
                <div>
                  <span style={{ color: '#7ee787', marginRight: 6 }}>$</span>
                  <span style={{ color: '#79c0ff' }}>bun run</span>{' '}
                  <span style={{ color: '#e6edf3' }}>build:win</span>
                </div>
                <div>
                  <span style={{ color: '#7ee787', marginRight: 6 }}>$</span>
                  <span style={{ color: '#79c0ff' }}>bun run</span>{' '}
                  <span style={{ color: '#e6edf3' }}>build:mac</span>
                </div>
                <div>
                  <span style={{ color: '#7ee787', marginRight: 6 }}>$</span>
                  <span style={{ color: '#79c0ff' }}>bun run</span>{' '}
                  <span style={{ color: '#e6edf3' }}>build:linux</span>
                </div>

                <div className="h-4" />

                <div style={{ color: '#6e7681' }}># Publish a new release</div>
                <div>
                  <span style={{ color: '#7ee787', marginRight: 6 }}>$</span>
                  <span style={{ color: '#79c0ff' }}>bun run</span>{' '}
                  <span style={{ color: '#e6edf3' }}>release:patch</span>
                </div>
                <div style={{ color: '#7ee787' }}><span style={{ marginRight: 6 }}>✔</span> Bumped to v1.0.7 · Tag pushed</div>
                <div style={{ color: '#7ee787' }}><span style={{ marginRight: 6 }}>✔</span> GitHub Actions CI triggered</div>
                <div style={{ color: '#7ee787' }}><span style={{ marginRight: 6 }}>✔</span> All lint &amp; type checks passed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
