import React, { useState } from 'react';
import { useGymStore, UserProfile } from '@/store/useGymStore';
import { Card } from './Card';
import { ChevronRight, ChevronLeft, Check, Compass, Heart } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { setProfile, generateProgram, setOnboarded } = useGymStore();
  const [step, setStep] = useState(1);

  // Form State
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [bodyFat, setBodyFat] = useState<number | undefined>(undefined);
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>('Beginner');
  const [selectedGoals, setSelectedGoals] = useState<UserProfile['goals']>(['Build Muscle']);
  const [environment, setEnvironment] = useState<UserProfile['environment']>('Full Gym');
  const [frequency, setFrequency] = useState(3);

  const totalSteps = 4;

  const handleGoalToggle = (goal: UserProfile['goals'][number]) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
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
    generateProgram();
    setOnboarded(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="text-sm font-bold text-slate-500">
            Step <span className="text-emerald-400">{step}</span> of {totalSteps}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx + 1 <= step ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/40 p-8 shadow-2xl relative">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>👋</span> Let&apos;s Get Acquainted
                </h2>
                <p className="text-slate-400 text-xs mt-1">Provide your details to calibrate your metabolic rate and target ranges.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 25))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 175))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 70))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                {/* Body Fat (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Body Fat % (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={bodyFat || ''}
                    onChange={(e) => setBodyFat(e.target.value ? Math.max(1, parseFloat(e.target.value)) : undefined)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Goals & Experience */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Heart className="h-6 w-6 text-rose-400" /> Choose Goals & Level
                </h2>
                <p className="text-slate-400 text-xs mt-1">Select your experience level and multiple targets to define your pathway.</p>
              </div>

              <div className="space-y-4">
                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Beginner', 'Novice', 'Intermediate', 'Advanced'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          experienceLevel === level
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
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

                {/* Goals Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Goals (Multi-select)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
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
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <span>{g}</span>
                          {isSel && <Check className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Environment & Frequency */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Compass className="h-6 w-6 text-indigo-400" /> Training Setup
                </h2>
                <p className="text-slate-400 text-xs mt-1">Specify your equipment accessibility and preferred training frequency.</p>
              </div>

              <div className="space-y-5">
                {/* Environment */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gym Environment</label>
                  <div className="grid grid-cols-2 gap-2">
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
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {envOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days Per Week</label>
                    <span className="text-emerald-400 font-bold text-sm">{frequency} Days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 px-1 font-bold">
                    <span>2 Days</span>
                    <span>3 Days</span>
                    <span>4 Days</span>
                    <span>5 Days</span>
                    <span>6 Days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Generate */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center py-2">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                  🚀
                </div>
                <h2 className="text-2xl font-black text-white">Coach is Ready!</h2>
                <p className="text-slate-400 text-xs mt-1">Review your parameters. We will assemble a custom roadmap based on fitness science.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/50 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500">Age / Gender:</span>
                  <span className="font-bold">{age} yrs / {gender}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500">Weight & Height:</span>
                  <span className="font-bold">{weight}kg / {height}cm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500">Level:</span>
                  <span className="font-bold text-emerald-400">{experienceLevel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500">Equipment:</span>
                  <span className="font-bold">{environment}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900/60">
                  <span className="text-slate-500">Frequency:</span>
                  <span className="font-bold">{frequency} times / week</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Selected Goals:</span>
                  <span className="font-bold text-indigo-400 max-w-[280px] text-right truncate">
                    {selectedGoals.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-slate-800/50">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ml-auto shadow-lg shadow-emerald-500/20 animate-pulse"
              >
                Generate My Workout Roadmap! <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
