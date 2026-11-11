import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem } from '../types';
import { FAQS_DATA } from '../data/faqs';

const FaqAccordionItem: React.FC<{ faq: FaqItem; isOpen: boolean; onToggle: () => void }> = ({
  faq,
  isOpen,
  onToggle,
}) => {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
        isOpen ? 'border-[#114232]/30 shadow-soft' : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-start justify-between gap-4 px-5 py-4 text-left transition-colors ${
          isOpen ? 'bg-[#114232]/5' : 'bg-white hover:bg-stone-50'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isOpen ? 'bg-[#114232] text-white' : 'bg-stone-100 text-stone-500'
          }`}>
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <span className={`text-sm font-bold leading-snug transition-colors ${
            isOpen ? 'text-[#0C2B1E]' : 'text-stone-800'
          }`}>
            {faq.question}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 shrink-0 mt-0.5 transition-all duration-300 ${
            isOpen ? 'rotate-180 text-[#114232]' : 'text-stone-400'
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 pt-1 bg-white">
          <div className="pl-9">
            <p className="text-sm text-stone-600 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS_DATA[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full px-4 py-1.5 mb-5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-xs font-bold text-stone-700 uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0C2B1E] tracking-tight mb-4">
            Pertanyaan yang Sering Diajukan.
          </h2>
          <p className="text-stone-500 text-base max-w-md mx-auto">
            Ada pertanyaan seputar TrailPass? Temukan jawabannya di sini, atau hubungi tim kami langsung.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq) => (
            <FaqAccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>

        <div className="mt-10 text-center p-6 bg-white rounded-2xl border border-stone-200 shadow-soft">
          <p className="text-sm text-stone-600 mb-3">
            Tidak menemukan jawaban yang dicari? Tim kami siap membantu.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:support@trailpass.id"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#114232] hover:text-lime-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition-colors"
            >
              Email Bantuan
            </a>
            <a
              href="https://instagram.com/trailpass.id"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl transition-colors"
            >
              Instagram @trailpass.id
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
