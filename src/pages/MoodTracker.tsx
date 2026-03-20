import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry, Mood } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, query, orderBy, onSnapshot, addDoc, where } from '../firebase';

const MOODS: { value: Mood; emoji: string; label: string; color: string; score: number }[] = [
  { value: 'terrible', emoji: '😢', label: 'سيء جداً', color: 'bg-red-100 text-red-600', score: 1 },
  { value: 'bad', emoji: '🙁', label: 'سيء', color: 'bg-orange-100 text-orange-600', score: 2 },
  { value: 'okay', emoji: '😐', label: 'عادي', color: 'bg-yellow-100 text-yellow-600', score: 3 },
  { value: 'good', emoji: '🙂', label: 'جيد', color: 'bg-emerald-100 text-emerald-600', score: 4 },
  { value: 'great', emoji: '😄', label: 'ممتاز', color: 'bg-green-100 text-green-600', score: 5 },
];

export default function MoodTracker() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'moods'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moodData: MoodEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          moodData.push({
            id: doc.id,
            date: data.timestamp,
            mood: data.mood as Mood,
            note: data.note || '',
          });
        }
      });
      setEntries(moodData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSave = async () => {
    if (!selectedMood || !user) return;

    try {
      await addDoc(collection(db, 'moods'), {
        userId: user.uid,
        mood: selectedMood,
        note: note.trim(),
        timestamp: new Date().toISOString()
      });
      
      setSelectedMood(null);
      setNote('');
      toast.success('تم حفظ مزاجك بنجاح! 💚');
    } catch (error) {
      console.error("Error saving mood:", error);
      toast.error('حدث خطأ أثناء حفظ المزاج');
    }
  };

  const chartData = entries
    .slice(0, 7)
    .reverse()
    .map((entry) => ({
      date: format(parseISO(entry.date), 'EEEE', { locale: arSA }),
      score: MOODS.find((m) => m.value === entry.mood)?.score || 3,
    }));

  const insights = useMemo(() => {
    if (entries.length === 0) return null;
    
    // Calculate most frequent mood in last 7 days
    const recentEntries = entries.slice(0, 7);
    const moodCounts = recentEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let topMood = '';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (typeof count === 'number' && count > maxCount) {
        maxCount = count;
        topMood = mood;
      }
    });

    const topMoodDef = MOODS.find(m => m.value === topMood);
    
    return {
      topMoodDef,
      count: recentEntries.length
    };
  }, [entries]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24" 
      dir="rtl"
    >
      <header className="bg-white px-6 py-6 border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 font-sans">كيف مزاجك اليوم؟</h1>
        <p className="text-sm text-gray-500 mt-1 font-sans">تتبع مشاعرك يساعدك تفهم نفسك أكثر.</p>
      </header>

      <main className="flex-1 p-6 space-y-8">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 font-sans">سجل مزاجك</h2>
          <div className="flex justify-between mb-6">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-2xl transition-all ${
                  selectedMood === m.value
                    ? 'bg-emerald-50 ring-2 ring-emerald-500 scale-110'
                    : 'hover:bg-gray-50 grayscale hover:grayscale-0 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xs font-medium text-gray-600 font-sans">{m.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="ودك تفضفض؟ اكتب اللي بخاطرك (اختياري)..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-24 font-sans"
                />
                <button
                  onClick={handleSave}
                  className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-2xl hover:bg-emerald-700 transition-colors shadow-sm font-sans"
                >
                  حفظ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {entries.length > 0 && (
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 font-sans">مزاجك في آخر 7 أيام</h2>
            
            {insights && insights.count > 2 && (
              <div className="mb-6 bg-emerald-50 rounded-2xl p-4 flex items-center space-x-3 space-x-reverse border border-emerald-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 bg-white shadow-sm`}>
                  {insights.topMoodDef?.emoji}
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-sans">أغلب مشاعرك مؤخراً كانت:</p>
                  <p className="font-bold text-emerald-800 font-sans">{insights.topMoodDef?.label}</p>
                </div>
              </div>
            )}

            <div className="h-48 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1, 5]} hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {entries.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 font-sans px-2">سجلك السابق</h2>
            {entries.map((entry) => {
              const moodDef = MOODS.find((m) => m.value === entry.mood);
              return (
                <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start space-x-4 space-x-reverse">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${moodDef?.color}`}>
                    {moodDef?.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-800 font-sans">{moodDef?.label}</span>
                      <span className="text-xs text-gray-400 font-sans">
                        {format(parseISO(entry.date), 'dd MMMM, hh:mm a', { locale: arSA })}
                      </span>
                    </div>
                    {entry.note && <p className="text-sm text-gray-600 font-sans mt-2 bg-gray-50 p-3 rounded-xl">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
    </motion.div>
  );
}
