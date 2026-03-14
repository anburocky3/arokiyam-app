import { FiDownload } from 'react-icons/fi';
import { FaWindows, FaApple, FaLinux } from 'react-icons/fa';

import { useGitHubRelease } from '../hooks/useGitHubRelease';

export default function Download() {
  const { version, loading } = useGitHubRelease();
  
  // Create download links dynamically based on the fetched version
  const cleanVersion = version.replace(/^v/, ''); // Remove 'v' if present
  
  const downloads = [
    {
      platform: 'Windows',
      type: 'Installer (.exe)',
      icon: <FaWindows size={30} />,
      os: 'windows',
      color: '#0078d4',
      url: `https://github.com/anburocky3/arokiyam-app/releases/download/${version}/arokiyam-${cleanVersion}-setup.exe`,
    },
    {
      platform: 'macOS',
      type: 'DMG Package',
      icon: <FaApple size={30} />,
      os: 'macos',
      color: '#a3aaae',
      url: `https://github.com/anburocky3/arokiyam-app/releases/download/${version}/arokiyam-${cleanVersion}.dmg`,
    },
    {
      platform: 'Linux',
      type: 'AppImage',
      icon: <FaLinux size={30} />,
      os: 'linux-appimage',
      color: '#f59e0b',
      url: `https://github.com/anburocky3/arokiyam-app/releases/download/${version}/arokiyam-${cleanVersion}.AppImage`,
    },
  ];
  return (
    <section
      className="relative py-[100px] md:py-[80px]"
      style={{ background: 'var(--gradient-section)' }}
      id="download"
    >
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4">
        <div className="text-center mb-14 md:mb-9">
          <h2 className="section-title fade-in">Download Arokiyam</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] max-w-[580px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Get started with Arokiyam on your favorite platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[400px] md:max-w-full lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
          {downloads.map((item, i) => (
            <a
              key={item.os}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`download-card fade-in fade-in-delay-${i + 1} flex flex-col items-center text-center cursor-pointer no-underline transition-all duration-300 py-4 px-3 group`}
              style={{ color: 'inherit' }}
            >
              <div
                className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-[1.08]"
                style={{
                  background: `${item.color}18`,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold text-[1rem] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{item.platform}</h3>
              <p className="text-[0.78rem] mb-4" style={{ color: 'var(--text-muted)' }}>{item.type}</p>
              <span
                className="inline-flex items-center gap-[6px] px-5 py-[9px] rounded-[10px] text-[0.8rem] font-semibold text-white transition-all duration-300 group-hover:opacity-90"
                style={{
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 2px 12px var(--accent-glow)',
                }}
              >
                <FiDownload size={14} />
                Download
              </span>
            </a>
          ))}
        </div>

        <p className="fade-in text-center mt-8 text-[0.85rem]" style={{ color: 'var(--text-muted)' }}>
          Latest stable release: <strong>{loading ? '...' : version}</strong>
        </p>
      </div>
    </section>
  );
}
