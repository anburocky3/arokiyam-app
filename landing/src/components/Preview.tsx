import Image from 'next/image'
import { useState, useEffect } from 'react'

const images = [
  { id: 1, title: 'App Dashboard', image: '/images/1.png' },
  { id: 2, title: 'Rest Your Eyes', image: '/images/2.png' },
  { id: 3, title: 'Reset Your Energy', image: '/images/3.png' },
  { id: 4, title: 'Hydration', image: '/images/4.png' },
  { id: 5, title: 'Focus Drink', image: '/images/5.png' },
  { id: 6, title: 'Preferences', image: '/images/6.png' }
]

export default function Screenshots() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [isHovered])

  return (
    <section
      className="relative py-12.5 md:py-20 overflow-hidden"
      id="preview"
      style={{ scrollMarginTop: '100px' }}
    >
      {/* Background glow for the laptop */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 rounded-full blur-[140px] opacity-[0.15] pointer-events-none"
        style={{ background: 'var(--accent-primary)' }}
      />

      <div className="w-full max-w-300 xl:max-w-350 2xl:max-w-400 mx-auto px-6 max-[480px]:px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="section-title fade-in mb-4">See Arokiyam in Action</h2>
          <p
            className="fade-in fade-in-delay-1 text-[1.05rem] max-w-145 mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Beautiful, non-intrusive overlays that protect your health while you code
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 fade-in fade-in-delay-2 relative z-20">
          {images.map((tab, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={tab.id}
                onClick={() => setActiveIndex(idx)}
                className="px-5 py-2.5 rounded-full text-[0.85rem] font-medium transition-all duration-300"
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
            )
          })}
        </div>

        <div className="fade-in fade-in-delay-3 w-full max-w-175 xl:max-w-212.5 2xl:max-w-250 mx-auto relative pt-4">
          <div
            className="relative rounded-2xl md:rounded-3xl p-2 md:p-3 pb-6 md:pb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto w-full aspect-[16/10] flex flex-col"
            style={{
              background: '#2d3340', // Metallic gray
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {/* Camera Dot */}
            <div className="absolute top-2 md:top-[3] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1a1a24] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] z-20"></div>

            {/* Screen Container */}
            <div
              className="relative w-full grow bg-[#0a0a0f] rounded-lg md:rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.03)] group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {images.map((shot, idx) => (
                <Image
                  key={shot.id}
                  src={shot.image}
                  width={0}
                  height={0}
                  alt={shot.title}
                  className="absolute inset-0 w-full h-full object-contain md:object-cover object-top transition-opacity duration-500 ease-in-out"
                  style={{
                    opacity: activeIndex === idx ? 1 : 0,
                    pointerEvents: activeIndex === idx ? 'auto' : 'none',
                    filter: activeIndex === idx ? 'none' : 'blur(4px)',
                    transform: activeIndex === idx ? 'scale(1)' : 'scale(1.02)'
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
          <div
            className="relative w-[115%] left-1/2 -translate-x-1/2 h-2.5 md:h-3.5 rounded-b-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            style={{
              background: 'linear-gradient(to bottom, #394050 0%, #222732 100%)',
              borderTop: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            {/* Trackpad notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[15%] h-1 bg-[#1a1d25] rounded-b-sm"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
