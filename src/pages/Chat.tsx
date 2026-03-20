import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, AlertCircle, Trash2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { ChatMessage } from '../types';
import { sendMessageToRafeeq } from '../services/geminiService';
import SOSModal from '../components/SOSModal';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, getDocs, auth, signOut, where, limit } from '../firebase';
import { Link } from 'react-router-dom';

const INITIAL_MESSAGE: ChatMessage = {
  id: '1',
  role: 'assistant',
  content: 'يا هلا ومسهلا! أنا رفيق، وشلونك اليوم؟ عساك بخير؟',
  timestamp: new Date().toISOString(),
};

const QUICK_REPLIES = [
  'أحس بقلق وتوتر 😥',
  'يومي كان صعب 💔',
  'أحتاج تمرين استرخاء 🧘‍♂️',
  'أبي أفضفض بس 🗣️'
];

export default function Chat() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MESSAGE_LIMIT = 5;

  useEffect(() => {
    if (!user) return;

    // Count messages sent today for free users
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const countQuery = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      where('role', '==', 'user'),
      where('timestamp', '>=', startOfDay.toISOString())
    );

    const unsubscribeCount = onSnapshot(countQuery, (snapshot) => {
      setDailyMessageCount(snapshot.size);
    });

    const q = query(
      collection(db, 'messages'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          msgs.push({
            id: doc.id,
            role: data.role,
            content: data.content,
            timestamp: data.timestamp,
          });
        }
      });
      
      if (msgs.length === 0) {
        const initialMsg = {
          userId: user.uid,
          role: 'assistant',
          content: 'يا هلا ومسهلا! أنا رفيق، وشلونك اليوم؟ عساك بخير؟',
          timestamp: new Date().toISOString()
        };
        addDoc(collection(db, 'messages'), initialMsg);
      } else {
        setMessages(msgs);
      }
    });

    return () => {
      unsubscribeCount();
      unsubscribe();
    };
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = async () => {
    if (!user) return;
    if (window.confirm('متأكد تبي تمسح المحادثة؟')) {
      try {
        const q = query(collection(db, 'messages'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs
          .map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        toast.success('تم مسح المحادثة بنجاح');
      } catch (error) {
        console.error("Error clearing chat:", error);
        toast.error('حدث خطأ أثناء مسح المحادثة');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading || !user || !profile) return;

    // Check limit for free users
    if (profile.subscription === 'free' && dailyMessageCount >= MESSAGE_LIMIT) {
      toast.error('لقد وصلت للحد اليومي للرسائل المجانية. اشترك في الباقة المميزة للحصول على رسائل غير محدودة!');
      return;
    }

    const userMessageContent = text.trim();
    setInput('');
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        role: 'user',
        content: userMessageContent,
        timestamp: new Date().toISOString()
      });

      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const response = await sendMessageToRafeeq(userMessageContent, history);

      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        role: 'assistant',
        content: response || 'عذراً، ما قدرت أفهمك زين. ممكن تعيد؟',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('عذراً، واجهت مشكلة تقنية. حاول مرة ثانية.');
      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        role: 'assistant',
        content: 'عذراً، واجهت مشكلة تقنية. حاول مرة ثانية بعد شوي.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLimitReached = profile?.subscription === 'free' && dailyMessageCount >= MESSAGE_LIMIT;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-4rem)] bg-[#FDFBF7]"
    >
      <header className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3 ml-3">
            <Bot className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 font-sans">رفيق (Rafeeq)</h1>
            <div className="flex items-center space-x-1 space-x-reverse">
              <p className="text-xs text-emerald-600 font-medium">متصل الآن</p>
              {profile?.subscription === 'premium' && (
                <span className="bg-emerald-100 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">PREMIUM</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button 
            onClick={handleClearChat}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="مسح المحادثة"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSOSOpen(true)}
            className="flex items-center space-x-1 space-x-reverse bg-red-50 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold font-sans">طوارئ</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24" dir="rtl">
        {profile?.subscription === 'free' && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 mb-4 text-center">
            <p className="text-xs text-amber-800 font-medium font-sans">
              لقد استخدمت {dailyMessageCount} من {MESSAGE_LIMIT} رسائل مجانية لهذا اليوم.
              <Link to="/subscription" className="text-emerald-600 font-bold mr-2 underline">اشترك الآن للرسائل غير المحدودة</Link>
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
                <span
                  className={`text-[10px] mt-2 block ${
                    msg.role === 'user' ? 'text-emerald-100' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center space-x-2 space-x-reverse">
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              <span className="text-sm text-gray-500 font-sans">رفيق يكتب...</span>
            </div>
          </motion.div>
        )}
        {messages.length === 1 && !isLoading && !isLimitReached && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {QUICK_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(reply)}
                className="bg-white border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-sans hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-sm"
              >
                {reply}
              </button>
            ))}
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="bg-white border-t border-gray-100 p-4 pb-safe fixed bottom-16 w-full max-w-md mx-auto left-0 right-0 z-20" dir="rtl">
        {isLimitReached ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
            <p className="text-sm text-red-800 font-bold mb-2 font-sans">انتهى حد الرسائل المجانية!</p>
            <Link to="/subscription" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold font-sans hover:bg-emerald-700 transition-colors">
              اشترك الآن للدردشة غير المحدودة
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-2 space-x-reverse bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="اكتب رسالتك لرفيق..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 font-sans"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-colors shrink-0"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
        )}
      </div>
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
    </motion.div>
  );
}
