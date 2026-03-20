export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'premium';
  subscriptionExpiry?: string;
  createdAt: string;
}

export type Mood = 'terrible' | 'bad' | 'okay' | 'good' | 'great';

export interface MoodEntry {
  id: string;
  date: string;
  mood: Mood;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | 'journaling' | 'reframing';
  durationMinutes: number;
}
