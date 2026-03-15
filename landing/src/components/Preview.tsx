import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const previewImages = [
  { id: 1, title: 'App Dashboard', image: '/previewImages/1.png' },
  { id: 2, title: 'Rest Your Eyes', image: '/previewImages/2.png' },
  { id: 3, title: 'Reset Your Energy', image: '/previewImages/3.png' },
  { id: 4, title: 'Hydration', image: '/previewImages/4.png' },
  { id: 5, title: 'Focus Drink', image: '/previewImages/5.png' },
  { id: 6, title: 'Preferences', image: '/previewImages/6.png' },
];

export default function Screenshots() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % previewImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % previewImages.length);
  };

  return (
    <section className="relative py-[100px] md:py-[80px] overflow-hidden" id="preview">
      {/* Background glow for the laptop */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-[0.15] pointer-events-none"
        style={{ background: 'var(--accent-primary)' }}
      />

      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 max-[480px]:px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="section-title fade-in mb-4">See Arokiyam in Action</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] max-w-[580px] mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Beautiful, non-intrusive overlays that protect your health while you code
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 fade-in fade-in-delay-2 relative z-20">
          {previewImages.map((tab, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveIndex(idx)}
                className="px-5 py-[10px] rounded-full text-[0.85rem] font-medium transition-all duration-300"
                style={{
                  background: isActive ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                  color: isActive ? '#fff' : 'var(--text-primary)',
                  boxShadow: isActive ? '0 4px 20px var(--accent-glow)' : 'none',
                  border: isActive ? '1px solid transparent' : '1px solid var(--border-glass)',
                  backdropFilter: isActive ? 'none' : 'var(--backdrop-blur)'
                }}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        <div className="fade-in fade-in-delay-3 w-full max-w-[700px] xl:max-w-[850px] 2xl:max-w-[1000px] mx-auto relative pt-4">
          <div
            className="relative rounded-[16px] md:rounded-[24px] p-[8px] md:p-3 pb-6 md:pb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto w-full aspect-[16/10] flex flex-col"
            style={{
              background: '#2d3340', // Metallic gray
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Camera Dot */}
            <div className="absolute top-[8px] md:top-[3] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1a1a24] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] z-20"></div>

            {/* Screen Container */}
            <div 
              className="relative w-full flex-grow bg-[#0a0a0f] rounded-[8px] md:rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.03)] group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {previewImages.map((shot, idx) => (
                <img
                  key={shot.id}
                  src={shot.image}
                  alt={shot.title}
                  className="absolute inset-0 w-full h-full object-contain md:object-cover object-top transition-opacity duration-500 ease-in-out"
                  style={{
                    opacity: activeIndex === idx ? 1 : 0,
                    pointerEvents: activeIndex === idx ? 'auto' : 'none',
                    filter: activeIndex === idx ? 'none' : 'blur(4px)',
                    transform: activeIndex === idx ? 'scale(1)' : 'scale(1.02)',
                  }}
                />
              ))}

              {/* Navigation Arrows */}
              {/* <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30"
              >
                <FiChevronRight size={24} />
              </button> */}
            </div>
          </div>

          {/* Laptop Base (Keyboard area projection) */}
          <div className="relative w-[115%] left-1/2 -translate-x-1/2 h-[10px] md:h-[14px] rounded-b-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            style={{
              background: 'linear-gradient(to bottom, #394050 0%, #222732 100%)',
              borderTop: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            {/* Trackpad notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[15%] h-[4px] bg-[#1a1d25] rounded-b-[4px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
