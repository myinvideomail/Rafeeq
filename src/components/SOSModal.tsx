import { motion, AnimatePresence } from 'motion/react';
import { Phone, X, AlertTriangle } from 'lucide-react';

export default function SOSModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 font-sans">تحتاج مساعدة طارئة؟</h2>
            <p className="text-sm text-gray-600 mb-6 font-sans leading-relaxed">
              إذا كنت تمر بأزمة نفسية حادة أو تفكر في إيذاء نفسك، أرجوك تذكر أنك لست وحدك وهناك من يهتم لأمرك. تواصل مع المختصين فوراً:
            </p>
            <div className="space-y-3">
              <a href="tel:997" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors group">
                <div>
                  <h3 className="font-semibold text-gray-900 font-sans group-hover:text-red-700">الإسعاف (طوارئ)</h3>
                  <p className="text-xs text-gray-500 font-sans">للحالات الطبية الحرجة</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
              <a href="tel:920033360" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                <div>
                  <h3 className="font-semibold text-gray-900 font-sans group-hover:text-emerald-700">تعزيز الصحة النفسية</h3>
                  <p className="text-xs text-gray-500 font-sans">استشارات نفسية (السعودية)</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
              <a href="tel:8004673" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                <div>
                  <h3 className="font-semibold text-gray-900 font-sans group-hover:text-emerald-700">خط الأمل</h3>
                  <p className="text-xs text-gray-500 font-sans">استشارات نفسية (الإمارات)</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
