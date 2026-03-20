import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, doc, updateDoc } from '../firebase';
import { User, MessageSquare, Shield, Bell, ChevronRight, LogOut, Heart, Zap, Coffee } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const TONE_OPTIONS = [
  { id: 'empathetic', label: 'أكثر تعاطفاً', description: 'يركز رفيق على مشاعرك ويدعمك بكلمات دافئة.', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'direct', label: 'أكثر صراحة', description: 'يقدم رفيق نصائح عملية ومباشرة لحل المشكلات.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'casual', label: 'أكثر عفوية', description: 'يتحدث رفيق معك كصديق مقرب بلهجة بسيطة.', icon: Coffee, color: 'text-blue-500', bg: 'bg-blue-50' },
];

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const [updating, setUpdating] = useState(false);

  const handleToneChange = async (toneId: string) => {
    if (!user) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        aiTone: toneId
      });
      toast.success('تم تحديث أسلوب رفيق بنجاح');
    } catch (error) {
      console.error('Error updating tone:', error);
      toast.error('عذراً، فشل التحديث');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8 max-w-md mx-auto">
      <header className="mb-8 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
          <User className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{profile?.displayName || 'مستخدم رفيق'}</h1>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          تخصيص شخصية رفيق
        </h2>
        <div className="space-y-3">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleToneChange(option.id)}
              disabled={updating}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-right flex items-start gap-4 ${
                profile?.aiTone === option.id
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-gray-100 bg-white hover:border-emerald-200'
              }`}
            >
              <div className={`p-3 rounded-xl ${option.bg} ${option.color}`}>
                <option.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">{option.label}</span>
                  {profile?.aiTone === option.id && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-2">
        <button className="w-full p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="font-medium">الخصوصية والأمان</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
        <button className="w-full p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="font-medium">التنبيهات</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
        <button 
          onClick={() => logout()}
          className="w-full p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between text-rose-600 hover:bg-rose-100 transition-colors mt-4"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">تسجيل الخروج</span>
          </div>
        </button>
      </div>
    </div>
  );
}
