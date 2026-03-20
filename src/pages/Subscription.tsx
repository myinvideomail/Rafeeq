import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Star, Shield, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, doc, updateDoc } from '../firebase';
import toast from 'react-hot-toast';

export default function Subscription() {
  const { profile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscriptionSuccess = async (details: any) => {
    if (!profile) return;
    
    setIsProcessing(true);
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, {
        subscription: 'premium',
        subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      });
      toast.success('تم تفعيل الاشتراك المميز بنجاح! 🎉');
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error('حدث خطأ أثناء تفعيل الاشتراك. يرجى التواصل مع الدعم.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPremium = profile?.subscription === 'premium';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24" 
      dir="rtl"
    >
      <header className="bg-white px-6 py-8 border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 font-sans">الاشتراك المميز</h1>
        <p className="text-sm text-gray-500 mt-1 font-sans">ارتقِ بتجربتك مع رفيق واحصل على دعم غير محدود.</p>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {isPremium ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-emerald-600 fill-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">أنت مشترك مميز!</h2>
            <p className="text-emerald-700 mb-6 leading-relaxed">
              تتمتع الآن بكافة المزايا والخصائص المتقدمة. شكراً لدعمك لرفيق.
            </p>
            <div className="text-sm text-emerald-600 font-medium">
              ينتهي اشتراكك في: {profile?.subscriptionExpiry ? new Date(profile.subscriptionExpiry).toLocaleDateString('ar-SA') : 'غير محدد'}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-emerald-600 text-white px-4 py-1 rounded-br-2xl text-xs font-bold">
                الأكثر شعبية
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">الباقة المميزة</h3>
                  <p className="text-sm text-gray-500">دعم نفسي متكامل بدون حدود</p>
                </div>
                <div className="text-left">
                  <span className="text-3xl font-bold text-emerald-600">9.99</span>
                  <span className="text-gray-500 text-sm"> دولار/شهر</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <FeatureItem text="محادثات غير محدودة مع رفيق" />
                <FeatureItem text="تحليل متقدم للمزاج والأنماط السلوكية" />
                <FeatureItem text="الوصول لكافة تمارين الاسترخاء الحصرية" />
                <FeatureItem text="أولوية في الرد والحصول على الميزات الجديدة" />
                <FeatureItem text="تجربة خالية تماماً من الإعلانات" />
              </ul>

              <div className="space-y-4">
                <a 
                  href="https://www.paypal.com/ncp/payment/GH3JKAP56LFZ2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0070ba] text-white font-bold py-4 rounded-full flex items-center justify-center hover:bg-[#005ea6] transition-colors shadow-md font-sans"
                >
                  <Zap className="w-5 h-5 ml-2" />
                  اشترك الآن عبر PayPal
                </a>

                <button
                  onClick={() => handleSubscriptionSuccess({})}
                  disabled={isProcessing}
                  className="w-full bg-white border-2 border-emerald-600 text-emerald-600 font-bold py-3 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors font-sans text-sm"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "لقد قمت بالدفع، فعل حسابي الآن"
                  )}
                </button>
                
                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  بالاشتراك، أنت توافق على شروط الخدمة. سيتم تجديد الاشتراك تلقائياً ما لم يتم إلغاؤه.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 ml-2 text-emerald-600" />
                لماذا تشترك في رفيق؟
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                اشتراكك يساعدنا على تطوير رفيق وتوفير أفضل التقنيات لدعم الصحة النفسية في العالم العربي. نحن نلتزم بأعلى معايير الخصوصية والأمان لبياناتك.
              </p>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center text-gray-700 text-sm">
      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center ml-3 shrink-0">
        <Check className="w-3 h-3 text-emerald-600" />
      </div>
      {text}
    </li>
  );
}
