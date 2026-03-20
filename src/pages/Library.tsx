import { Headphones, PlayCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function Library() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24" 
      dir="rtl"
    >
      <header className="bg-white px-6 py-6 border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 font-sans">المكتبة</h1>
        <p className="text-sm text-gray-500 mt-1 font-sans">محتوى هادف يساعدك تفهم نفسك وتطور مهاراتك.</p>
      </header>

      <main className="flex-1 p-6 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 font-sans flex items-center">
              <Headphones className="w-5 h-5 ml-2 text-emerald-600" />
              تأمل واسترخاء
            </h2>
          </div>
          <div className="flex overflow-x-auto space-x-4 space-x-reverse pb-4 snap-x">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[240px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 snap-start shrink-0">
                <div className="w-full h-32 bg-emerald-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <img src={`https://picsum.photos/seed/meditation${i}/400/300?blur=2`} alt="Meditation" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <PlayCircle className="w-12 h-12 text-white relative z-10 opacity-90 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-gray-900 font-sans text-sm mb-1">جلسة استرخاء عميق</h3>
                <p className="text-xs text-gray-500 font-sans">بصوت هادئ ومريح (10 دقائق)</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 font-sans flex items-center">
              <FileText className="w-5 h-5 ml-2 text-sky-600" />
              مقالات تهمك
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { title: 'كيف تتعامل مع القلق من المستقبل؟', category: 'القلق', color: 'bg-orange-100 text-orange-700' },
              { title: 'أهمية وضع حدود صحية في العلاقات', category: 'العلاقات', color: 'bg-rose-100 text-rose-700' },
              { title: 'طرق عملية للتغلب على الضغط الدراسي', category: 'الضغوطات', color: 'bg-indigo-100 text-indigo-700' },
            ].map((article, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex-1 ml-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block font-sans ${article.color}`}>
                    {article.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 font-sans text-sm leading-snug">{article.title}</h3>
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img src={`https://picsum.photos/seed/article${i}/200/200`} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
