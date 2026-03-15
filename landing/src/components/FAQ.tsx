import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: 'Who created Arokiyam?',
    answer: <>Arokiyam was designed and developed by <a href="https://github.com/anburocky3" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:text-blue-500"><span className='text-blue-500 hover:underline'>Anbuselvan Annamalai</span></a>.</>
  },
  {
    question: 'Who built this landing page?',
    answer: <>This landing page was designed and developed by <a href="https://github.com/Gokulproject5" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] "><span className='text-blue-500 hover:underline'>Gokulakrishnan A</span></a> and <a href="https://github.com/saranmuthukumark-cpu" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:text-blue-500"><span className='text-blue-500 hover:underline'>Saranmuthukumar K</span></a>.</>
  },
  {
    question: 'How does Arokiyam track my stress?',
    answer: 'Arokiyam analyzes your keyboard typing patterns and mouse movements locally on your machine to estimate your stress levels. We look for signs like erratic typing, heavy keystrokes, or jerky mouse movement.'
  },
  {
    question: 'Is my keystroke data sent to the cloud?',
    answer: 'No. All processing happens entirely offline and locally on your device. We never send your keystrokes, screen contents, or any personal data to our servers. Arokiyam is completely private by design.'
  },
  {
    question: 'What platforms does Arokiyam support?',
    answer: 'Currently, we support Windows and macOS. We also offer an AppImage for Linux users. Please refer to our download section for the latest packages.'
  },
  {
    question: 'What is the "Health Battery" model?',
    answer: 'The Health Battery is an intuitive way to track your daily energy. It drains when you are actively coding or showing signs of stress. Taking breaks, stretching, or resting will recharge your virtual battery.'
  },
  {
    question: 'Is the app free to use?',
    answer: 'Yes! Arokiyam is an open-source project and is completely free to download and use. If you like the project, supporting us by starring the repository on GitHub is greatly appreciated.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-[50px] md:py-[80px]" id="faq" style={{ scrollMarginTop: '100px' }}>
      <div className="w-full max-w-[800px] xl:max-w-[900px] mx-auto px-6 max-[480px]:px-4 relative z-1">
        <div className="text-center mb-14 md:mb-9">
          <h2 className="section-title fade-in mb-4">Frequently Asked Questions</h2>
          <p className="fade-in fade-in-delay-1 text-[1.05rem] text-[var(--text-secondary)]">
            Everything you need to know about how Arokiyam works.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`fade-in fade-in-delay-${(index % 4) + 1} overflow-hidden rounded-2xl border transition-all duration-300`}
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-glass)',
                }}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none transition-colors duration-200"
                  style={{ color: isOpen ? 'var(--accent-primary-hover)' : 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.style.borderColor = 'var(--border-glass-hover)';
                  }}
                  onMouseLeave={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.style.borderColor = 'var(--border-glass)';
                  }}
                  onClick={() => toggleFaQ(index)}
                >
                  <span className="font-semibold text-[1.05rem] pr-8">{faq.question}</span>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-primary)' }}
                  >
                    <FiChevronDown size={18} />
                  </div>
                </button>
                <div
                  className="transition-all duration-500 ease-in-out px-6"
                  style={{
                    maxHeight: isOpen ? '200px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                  }}
                >
                  <p className="pb-6 text-[0.95rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
