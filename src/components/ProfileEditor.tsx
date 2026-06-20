import React, { useState } from 'react';
import { useGymStore, UserProfile } from '@/store/useGymStore';
import { Card } from './Card';
import { Save, User, RefreshCw } from 'lucide-react';

export const ProfileEditor: React.FC = () => {
  const { profile, setProfile, loggedInUser, generateProgram } = useGymStore();
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [bodyFat, setBodyFat] = useState<number | undefined>(profile.bodyFat);
  const [experienceLevel, setExperienceLevel] = useState(profile.experienceLevel);
  const [selectedGoals, setSelectedGoals] = useState(profile.goals);
  const [environment, setEnvironment] = useState(profile.environment);
  const [frequency, setFrequency] = useState(profile.frequency);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile({
      age,
      gender,
      height,
      weight,
      bodyFat,
      experienceLevel,
      goals: selectedGoals,
      environment,
      frequency,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleGoalToggle = (goal: UserProfile['goals'][number]) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl w-full">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="text-emerald-400" size={24} />
          Profile Settings
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          Signed in as <span className="text-emerald-400 font-semibold">{loggedInUser?.name}</span>
        </p>
      </div>

      <Card className="border-zinc-800">
        <div className="space-y-5">
          <h3 className="font-bold text-white text-sm">Personal Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 25))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 175))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 70))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Body Fat % (Optional)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 15"
              value={bodyFat || ''}
              onChange={(e) => setBodyFat(e.target.value ? Math.max(1, parseFloat(e.target.value)) : undefined)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>
      </Card>

      <Card className="border-zinc-800">
        <div className="space-y-5">
          <h3 className="font-bold text-white text-sm">Training Settings</h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Experience Level</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Beginner', 'Novice', 'Intermediate', 'Advanced'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setExperienceLevel(level)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    experienceLevel === level
                      ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {level === 'Beginner' && 'Beginner (0-6m)'}
                  {level === 'Novice' && 'Novice (6-12m)'}
                  {level === 'Intermediate' && 'Intermediate (1-3y)'}
                  {level === 'Advanced' && 'Advanced (3y+)'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Target Goals (Multi-select)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {([
                'Build Muscle', 'Lose Fat', 'Body Recomposition', 'Gain Strength',
                'Improve Athletic Performance', 'General Fitness', 'Powerlifting', 'Bodybuilding'
              ] as UserProfile['goals']).map((g) => {
                const isSel = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGoalToggle(g)}
                    className={`px-3 py-2 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSel
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-800'
                    }`}
                  >
                    <span>{g}</span>
                    {isSel && <span className="text-emerald-400 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Gym Environment</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'Full Gym', label: '🏟️ Full Gym' },
                { id: 'Home Gym', label: '🏠 Home Gym' },
                { id: 'Dumbbells Only', label: '💪 Dumbbells Only' },
                { id: 'Bodyweight Only', label: '🤸 Bodyweight Only' },
              ].map((envOption) => (
                <button
                  key={envOption.id}
                  type="button"
                  onClick={() => setEnvironment(envOption.id as 'Full Gym' | 'Home Gym' | 'Dumbbells Only' | 'Bodyweight Only')}
                  className={`px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    environment === envOption.id
                      ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {envOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Days Per Week</label>
              <span className="text-emerald-400 font-bold text-sm">{frequency} Days</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 px-1 font-bold">
              <span>2 Days</span>
              <span>3 Days</span>
              <span>4 Days</span>
              <span>5 Days</span>
              <span>6 Days</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
        >
          <Save size={16} /> {saved ? 'Saved!' : 'Save Profile Changes'}
        </button>
        <button
          onClick={() => {
            setProfile({ age, gender, height, weight, bodyFat, experienceLevel, goals: selectedGoals, environment, frequency });
            generateProgram();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="py-3 px-5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-sm hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} /> Regenerate Program
        </button>
      </div>
    </div>
  );
};
