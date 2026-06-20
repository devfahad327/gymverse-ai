import React, { useState, useEffect, useRef } from 'react';
import { useGymStore } from '@/store/useGymStore';
import { Send, Bot, User, BrainCircuit, Sparkles, Key } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export const AICoach: React.FC = () => {
  const { profile, activeProgram, workoutLogs, openAiKey, getCalculatedNutritionGoals, getRecoveryScore } = useGymStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initialize with a welcome message
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${profile.gender === 'Male' ? 'sir' : profile.gender === 'Female' ? 'ma\'am' : 'mate'}! I am your GymVerse AI coach. 🏋️‍♂️\n\nI see your experience level is **${profile.experienceLevel}** and your target is **${profile.goals.join(' & ')}** using a **${profile.environment}** setup.\n\nAsk me anything! For example:\n- "Is my workout effective?"\n- "What exercise can replace squats?"\n- "How much protein/calories do I need?"\n- "Why am I not growing?"`,
      timestamp: Date.now()
    };
    setMessages([welcomeMsg]);
  }, [profile]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Local Rules-Based Response Engine
  const generateLocalResponse = (query: string): string => {
    const q = query.toLowerCase();
    const macros = getCalculatedNutritionGoals();
    const todayStr = new Date().toISOString().split('T')[0];
    const recScore = getRecoveryScore(todayStr);

    if (q.includes('protein') || q.includes('calorie') || q.includes('macro') || q.includes('diet') || q.includes('eat') || q.includes('food')) {
      return `Based on your parameters (Age: ${profile.age}, Weight: ${profile.weight}kg, Goal: ${profile.goals[0]}), here are your calculated daily targets:\n\n` +
             `🔥 **Daily Calories**: ${macros.calories} kcal\n` +
             `💪 **Protein**: ${macros.protein}g (approx. 2.2g/kg)\n` +
             `🍞 **Carbohydrates**: ${macros.carbs}g\n` +
             `🥑 **Fats**: ${macros.fat}g\n\n` +
             `For your goal of **${profile.goals[0]}**, I suggest eating whole protein sources (chicken, eggs, beef, tofu, whey) and complex carbs (oats, rice, sweet potato). Adjust calories by 100-200 kcal if your weight scales too fast or slow.`;
    }

    if (q.includes('squat') && (q.includes('replace') || q.includes('alternative') || q.includes('substitute') || q.includes('instead'))) {
      if (profile.environment === 'Dumbbells Only') {
        return `Since you are training with a **Dumbbells Only** setup, replace Barbell Back Squats with:\n\n` +
               `1. **Dumbbell Bulgarian Split Squats** (Excellent quad & glute builder with less spine loading).\n` +
               `2. **Dumbbell Goblet Squats** (Great for maintaining vertical chest and core stability).\n` +
               `3. **Dumbbell Romanian Deadlifts** (Focuses on glutes and hamstring chain).`;
      }
      if (profile.environment === 'Bodyweight Only') {
        return `Since you are training with **Bodyweight Only**, you can replace squats with:\n\n` +
               `1. **Pistol Squats** (Single-leg squats - advanced strength/balance builder).\n` +
               `2. **Deficit Airborne Lunges** (Superb quad builder).\n` +
               `3. **Deep Squat Holds & Cossack Squats** (Builds incredible joint mobility and strength).`;
      }
      return `Here are the top alternatives to replace Barbell Back Squats in a **${profile.environment}** environment:\n\n` +
             `1. **Leg Press** (High quad load with lower back support).\n` +
             `2. **Bulgarian Split Squats** (Unilateral leg builder - targets imbalances).\n` +
             `3. **Hack Squats or Goblet Squats** (Safer range of motion and great quad isolation).`;
    }

    if (q.includes('grow') || q.includes('plateau') || q.includes('not building') || q.includes('gaining') || q.includes('stuck')) {
      const logsCount = workoutLogs.length;
      return `Plateaus are common! As an **${profile.experienceLevel}** athlete, here is my diagnosis:\n\n` +
             `1. **Progressive Overload**: You must add reps or weight over time. You have logged **${logsCount}** workouts in history. Make sure you are pushing to a high intensity (RPE 8-9).\n` +
             `2. **Nutrition**: If your goal is to build muscle, you must consume a caloric surplus (+300-500 kcal). Your current target is **${macros.calories} kcal** with **${macros.protein}g** of protein.\n` +
             `3. **Recovery**: Muscles grow when you rest. Your computed recovery score is **${recScore}/100**. Ensure you sleep 8+ hours and manage stress levels.`;
    }

    if (q.includes('effective') || q.includes('my program') || q.includes('plan') || q.includes('split')) {
      if (!activeProgram) {
        return `You haven't generated a training program yet! Go to the **Workout Planner** tab and complete onboarding to generate your customized roadmap.`;
      }
      return `Your active program is **${activeProgram.name}** (${activeProgram.splitName} split, ${profile.frequency} days/week).\n\n` +
             `**Is it effective? Yes!** Here is why:\n` +
             `- It aligns with your experience level (**${profile.experienceLevel}**) and targets your goals (**${profile.goals.join(', ')}**).\n` +
             `- It matches your environment (**${profile.environment}**).\n` +
             `- It alternates compound lifts with high hypertrophy accessory movements to build mass without fatiguing the nervous system.\n\n` +
             `Focus on consistency, track your lifts in GymVerse, and let's keep progressing!`;
    }

    if (q.includes('recovery') || q.includes('sleep') || q.includes('water') || q.includes('tired') || q.includes('rest')) {
      return `Let's look at your recovery indices today:\n` +
             `- **Today's Recovery Score**: ${recScore}/100\n` +
             `- **Avg Target Sleep**: 8 hours\n\n` +
             `If you feel fatigued (Score below 60), I recommend: \n` +
             `1. Reducing active workout intensity (do a deload session or leave 3-4 reps in reserve).\n` +
             `2. Increasing water intake (drink 3-4 liters daily).\n` +
             `3. Keeping sleep regular and tracking sleep cycles.`;
    }

    if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
      return `Hey there! Coach here. Ready to smash today's training? Let me know what you need help with—diet calculations, exercise substitutions, or form tips.`;
    }

    return `Interesting question! As your personal AI coach, I suggest focusing on core training fundamentals: progressive overload, eating **${macros.protein}g of protein**, sleeping 8 hours, and staying consistent with **${activeProgram?.name || 'your program'}**.\n\nIs there a specific exercise substitution or nutritional target you'd like me to detail?`;
  };

  // Handle Send Message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      let aiText = '';

      if (openAiKey) {
        // Generative AI route (simulated client-side call or request hitting a route)
        try {
          const response = await fetch('/api/coach', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
              query: userMsg.text,
              profile,
              activeProgram,
              workoutLogs: workoutLogs.slice(0, 5) // pass last few logs for context
            })
          });
          const data = await response.json();
          aiText = data.text || "I apologize, I couldn't process that response.";
        } catch {
          aiText = "Failed to reach OpenAI servers. Using local AI Coach Engine fallback:\n\n" + generateLocalResponse(userMsg.text);
        }
      } else {
        // Fallback local engine
        aiText = generateLocalResponse(userMsg.text);
      }

      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: aiText,
        timestamp: Date.now()
      }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[750px] border border-slate-800 rounded-2xl bg-slate-900/30 backdrop-blur-md overflow-hidden relative shadow-2xl">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BrainCircuit className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
              GymVerse AI Coach <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            </h3>
            <p className="text-[10px] text-emerald-400/80 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
              Active Coaching Agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-slate-950 border border-slate-850 text-slate-400">
          <Key className="h-3 w-3 text-slate-500" />
          <span>{openAiKey ? 'OpenAI GPT Active' : 'Local Engine Mode'}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center border
              ${msg.sender === 'user'
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }
            `}>
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-md
              ${msg.sender === 'user'
                ? 'bg-indigo-650 text-white rounded-tr-none'
                : 'bg-slate-950/90 border border-slate-800/80 text-slate-200 rounded-tl-none'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 bg-slate-950/90 border border-slate-800/80 text-slate-400 rounded-2xl rounded-tl-none flex items-center gap-1 text-xs">
              <span>Thinking</span>
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
      </div>

      {/* Form Input Bar */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800/80 bg-slate-900/30 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about exercises, routines, diet ratios, or plateau fixes..."
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
        <button
          type="submit"
          className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all cursor-pointer flex items-center justify-center"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
