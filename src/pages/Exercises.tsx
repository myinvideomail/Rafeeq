import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { Wind, BookHeart, RefreshCw, Play, Pause, RotateCcw, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Exercises() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeExercise, setActiveExercise] = useState<'breathing' | 'gratitude' | 'reframing' | null>(null);

  const handleExerciseClick = (type: 'breathing' | 'gratitude' | 'reframing', isPremium: boolean) => {
    if (isPremium && profile?.subscription === 'free') {
      toast.error('هذا التمرين متاح فقط للمشتركين المميزين.');
      navigate('/subscription');
      return;
    }
    setActiveExercise(type);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24" 
      dir="rtl"
    >
      <header className="bg-white px-6 py-6 border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 font-sans">تمارين الاسترخاء</h1>
        <p className="text-sm text-gray-500 mt-1 font-sans">خطوات بسيطة تساعدك ترتاح وتصفي ذهنك.</p>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <AnimatePresence mode="wait">
          {!activeExercise ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid gap-4"
            >
              <ExerciseCard
                icon={Wind}
                title="تمرين التنفس العميق 4-7-8"
                description="يساعد على الاسترخاء السريع وتقليل التوتر."
                duration="3 دقائق"
                color="bg-sky-100 text-sky-600"
                onClick={() => handleExerciseClick('breathing', false)}
              />
              <ExerciseCard
                icon={BookHeart}
                title="مذكرات الامتنان"
                description="اكتب 3 أشياء أنت ممتن لها اليوم."
                duration="5 دقائق"
                color="bg-rose-100 text-rose-600"
                onClick={() => handleExerciseClick('gratitude', false)}
              />
              <ExerciseCard
                icon={RefreshCw}
                title="إعادة صياغة الأفكار السلبية"
                description="تمرين CBT لتحدي الأفكار المزعجة."
                duration="10 دقائق"
                color="bg-indigo-100 text-indigo-600"
                isPremium={true}
                onClick={() => handleExerciseClick('reframing', true)}
              />
            </motion.div>
          ) : activeExercise === 'breathing' ? (
            <BreathingExercise onBack={() => setActiveExercise(null)} />
          ) : activeExercise === 'gratitude' ? (
            <GratitudeExercise onBack={() => setActiveExercise(null)} />
          ) : (
            <ReframingExercise onBack={() => setActiveExercise(null)} />
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

function ExerciseCard({ icon: Icon, title, description, duration, color, onClick, disabled, isPremium }: any) {
  const { profile } = useAuth();
  const locked = isPremium && profile?.subscription === 'free';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-start space-x-4 space-x-reverse text-right transition-all relative ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:border-emerald-200 active:scale-[0.98]'
      }`}
    >
      {locked && (
        <div className="absolute top-4 left-4">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-7 h-7" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-900 font-sans text-lg">{title}</h3>
          {isPremium && (
            <span className="mr-2 bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">PREMIUM</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1 font-sans leading-relaxed">{description}</p>
        <div className="mt-3 flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
          {duration}
        </div>
      </div>
    </button>
  );
}

function BreathingExercise({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(4); // Start with inhale (4s)

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(7);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(8);
      } else if (phase === 'exhale') {
        setPhase('inhale');
        setTimeLeft(4);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(4);
  };

  const getInstruction = () => {
    switch (phase) {
      case 'inhale': return 'خذ نفس عميق...';
      case 'hold': return 'احبس نفسك...';
      case 'exhale': return 'زفير ببطء...';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[60vh]"
    >
      <button onClick={onBack} className="self-start text-sm text-gray-500 hover:text-emerald-600 mb-8 font-sans flex items-center">
        &rarr; رجوع للتمارين
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-12 font-sans text-center">تمرين 4-7-8</h2>

      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        <motion.div
          animate={{ scale: isActive ? getCircleScale() : 1 }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0, ease: 'easeInOut' }}
          className={`absolute w-32 h-32 rounded-full opacity-20 ${
            phase === 'inhale' ? 'bg-sky-400' : phase === 'hold' ? 'bg-indigo-400' : 'bg-emerald-400'
          }`}
        />
        <motion.div
          animate={{ scale: isActive ? getCircleScale() : 1 }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0, ease: 'easeInOut' }}
          className={`absolute w-24 h-24 rounded-full opacity-40 ${
            phase === 'inhale' ? 'bg-sky-500' : phase === 'hold' ? 'bg-indigo-500' : 'bg-emerald-500'
          }`}
        />
        <div className="relative z-10 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800 font-mono">{timeLeft}</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-8 font-sans h-8">{isActive ? getInstruction() : 'مستعد؟'}</h3>

      <div className="flex space-x-4 space-x-reverse">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 shadow-md transition-transform active:scale-95"
        >
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-transform active:scale-95"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}

function GratitudeExercise({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState(['', '', '']);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (items.some(item => item.trim() !== '')) {
      setIsSaved(true);
      toast.success('تم حفظ مذكراتك بنجاح! 📝');
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[60vh]"
    >
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-rose-600 mb-6 font-sans flex items-center">
        &rarr; رجوع للتمارين
      </button>

      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
        <BookHeart className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 font-sans">مذكرات الامتنان</h2>
      <p className="text-gray-600 mb-8 font-sans text-sm leading-relaxed">
        التركيز على النعم البسيطة يقلل من التوتر ويزيد من الشعور بالسعادة. اكتب 3 أشياء أنت ممتن لها اليوم، مهما كانت صغيرة.
      </p>

      {isSaved ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-emerald-600">
          <CheckCircle2 className="w-16 h-16 mb-4" />
          <p className="font-bold font-sans text-lg">تم الحفظ بنجاح!</p>
          <p className="text-sm text-gray-500 mt-2 font-sans">الله يديم عليك النعم.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-300 font-bold text-lg">{index + 1}</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = e.target.value;
                  setItems(newItems);
                }}
                placeholder="أنا ممتن لـ..."
                className="w-full bg-rose-50/50 border border-rose-100 rounded-2xl py-4 pr-10 pl-4 text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent font-sans"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={!items.some(item => item.trim() !== '')}
            className="w-full bg-rose-600 text-white font-semibold py-4 rounded-2xl hover:bg-rose-700 transition-colors shadow-sm font-sans mt-8 disabled:opacity-50"
          >
            حفظ المذكرات
          </button>
        </div>
      )}
    </motion.div>
  );
}

function ReframingExercise({ onBack }: { onBack: () => void }) {
  const [negative, setNegative] = useState('');
  const [positive, setPositive] = useState('');
  const [step, setStep] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  const handleNext = () => {
    if (step === 1 && negative.trim()) setStep(2);
    else if (step === 2 && positive.trim()) {
      setIsSaved(true);
      toast.success('تم إعادة صياغة الفكرة بنجاح! 🧠');
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[60vh]"
    >
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-indigo-600 mb-6 font-sans flex items-center">
        &rarr; رجوع للتمارين
      </button>

      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
        <RefreshCw className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 font-sans">إعادة صياغة الأفكار</h2>
      <p className="text-gray-600 mb-8 font-sans text-sm leading-relaxed">
        أفكارنا تؤثر على مشاعرنا. هذا التمرين يساعدك على اصطياد الفكرة السلبية واستبدالها بفكرة أكثر واقعية.
      </p>

      {isSaved ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-indigo-600">
          <CheckCircle2 className="w-16 h-16 mb-4" />
          <p className="font-bold font-sans text-lg">ممتاز جداً!</p>
          <p className="text-sm text-gray-500 mt-2 font-sans text-center">أنت الآن تتحكم بأفكارك بشكل أفضل.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">1. وش الفكرة السلبية اللي تدور براسك؟</label>
                <textarea
                  value={negative}
                  onChange={(e) => setNegative(e.target.value)}
                  placeholder="مثال: أنا فاشل ومستحيل أنجح في هذا المشروع..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32 font-sans"
                />
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                  <p className="text-xs text-gray-500 mb-1 font-sans">الفكرة السلبية:</p>
                  <p className="text-sm text-gray-800 font-sans">{negative}</p>
                </div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">2. كيف ممكن نعيد صياغتها بشكل إيجابي وواقعي؟</label>
                <textarea
                  value={positive}
                  onChange={(e) => setPositive(e.target.value)}
                  placeholder="مثال: المشروع صعب، بس أنا قاعد أتعلم وأبذل جهدي، والخطأ جزء من التعلم..."
                  className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32 font-sans"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleNext}
            disabled={(step === 1 && !negative.trim()) || (step === 2 && !positive.trim())}
            className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-sm font-sans disabled:opacity-50"
          >
            {step === 1 ? 'التالي' : 'حفظ الفكرة الجديدة'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
