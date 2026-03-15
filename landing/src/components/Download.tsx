import { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { FaWindows, FaApple } from 'react-icons/fa';

import { useGitHubRelease } from '@/hooks/useGitHubRelease';
import Image from 'next/image';

export default function Download() {
  const { version } = useGitHubRelease();
  const [userOS, setUserOS] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('mac')) setUserOS('macos');
    else if (ua.includes('linux')) setUserOS('linux');
    else if (ua.includes('win')) setUserOS('windows');
  }, []);
  
  const cleanVersion = version.replace(/^v/, '');
  
  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      desc: 'Windows 10, 11',
      icon: <FaWindows className="w-24 h-24 md:w-32 md:h-32 text-[#0078d4]" />,
      buttons: [
        { label: 'Windows', sub: 'Windows 10, 11', url: `https://github.com/anburocky3/arokiyam-app/releases/download/${version}/arokiyam-${cleanVersion}-setup.exe` }
      ]
    },
    {
      id: 'linux',
      name: 'Linux',
      desc: 'Ubuntu, Debian, Fedora',
      icon: <Image src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Linux" className="w-24 h-24 md:w-32 md:h-32" />,
      buttons: [
        { label: '.AppImage', sub: 'Universal Linux', url: `https://github.com/anburocky3/arokiyam-app/releases/download/${version}/arokiyam-${cleanVersion}.AppImage` },
      ]
    },
    {
      id: 'macos',
      name: 'Mac',
      desc: 'macOS 11.0+',
      icon: <FaApple className="w-24 h-24 md:w-32 md:h-32 text-white" />,
      buttons: [
        { label: 'Mac', sub: 'macOS 11.0+', url: `https://github.com/anburocky3/arokiyam-app/releases/download/${version}/arokiyam-${cleanVersion}.dmg` }
      ]
    }
  ];

  return (
    <section className="relative py-24 md:py-32 bg-[#0a0a0a]" id="download" style={{ scrollMarginTop: '100px' }}>
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Download Arokiyam</h2>
          <p className="text-lg opacity-60">Free and open source. Available on all major platforms.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {platforms.map((platform) => {
            const isDetected = mounted && userOS === platform.id;
            return (
              <div 
                key={platform.id} 
                className={`flex flex-col items-center transition-all duration-300 ${isDetected ? 'scale-105' : 'opacity-80'}`}
              >
                {/* Platform Icon */}
                <div className="mb-10 flex items-center justify-center p-4">
                  {platform.icon}
                </div>

                {/* Download Buttons Area */}
                <div className="flex flex-wrap justify-center gap-5 w-full px-4">
                  {platform.buttons.map((btn, idx) => (
                    <a
                      key={idx}
                      href={btn.url}
                      className={`grow md:grow-0 flex items-center gap-5 px-8 py-5 rounded-2xl transition-all duration-300 min-w-[240px] group/btn ${
                        isDetected 
                        ? 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] hover:scale-[1.03]' 
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`p-3 rounded-xl transition-colors ${isDetected ? 'bg-white/20' : 'bg-white/5'}`}>
                        <FiDownload size={24} strokeWidth={2.5} className="group-hover/btn:translate-y-0.5 transition-transform" />
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold leading-tight mb-0.5">{btn.label}</div>
                        <div className={`text-xs font-medium uppercase tracking-wider ${isDetected ? 'text-white/70' : 'text-white/40'}`}>
                          {btn.sub}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                
                {isDetected && (
                   <div className="mt-4 text-[0.75rem] font-bold text-blue-400 uppercase tracking-widest animate-pulse">
                      Recommended for your system
                   </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
            <p className="text-sm text-gray-500">
                Latest Version: <span className="text-white font-mono">{version}</span> • 
                <a href="https://github.com/anburocky3/arokiyam-app/releases" target="_blank" className="ml-2 text-blue-400 hover:underline">Release Notes</a>
            </p>
        </div>
      </div>
    </section>
  );
}
