import React, { useState, useEffect, useRef } from 'react';
import { useGymStore } from '@/store/useGymStore';
import { generateExerciseLibrary } from '@/data/exercises';
import { Card } from './Card';
import { ExerciseVisual } from './ExerciseVisual';
import { Plus, Trash2, CheckCircle2, PlusCircle, Search, Clock, X } from 'lucide-react';

export const ActiveWorkoutTracker: React.FC = () => {
  const {
    activeWorkout,
    updateWorkoutSet,
    addSetToExercise,
    removeSetFromExercise,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    finishWorkout,
    cancelWorkout,
  } = useGymStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  
  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [totalRestDuration] = useState(90);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound effect using Web Audio API (no external asset files needed!)
  const playBeep = (freq = 800, duration = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked: ", e);
    }
  };

  // Live Workout Timer
  useEffect(() => {
    if (activeWorkout) {
      const start = activeWorkout.startTime || Date.now();
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeWorkout]);

  // Rest Timer Effect
  useEffect(() => {
    if (restTimerActive && restSecondsLeft > 0) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            setRestTimerActive(false);
            if (restTimerRef.current) clearInterval(restTimerRef.current);
            // play double high beep
            playBeep(1200, 0.15);
            setTimeout(() => playBeep(1200, 0.15), 180);
            return 0;
          }
          if (prev <= 4) {
            // tick warning
            playBeep(600, 0.05);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [restTimerActive, restSecondsLeft]);

  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  if (!activeWorkout) return null;

  // Format Elapsed Time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Start Rest Timer
  const triggerRestTimer = () => {
    setRestSecondsLeft(totalRestDuration);
    setRestTimerActive(true);
    playBeep(900, 0.1);
  };

  const handleSetToggleComplete = (exIdx: number, setIdx: number, currentCompleted: boolean) => {
    updateWorkoutSet(exIdx, setIdx, { completed: !currentCompleted });
    
    // If completed set, trigger rest timer
    if (!currentCompleted) {
      triggerRestTimer();
    }
  };

  const { customExercises } = useGymStore();

  // Exercise Filter for adding
  const searchFilteredExercises = [...generateExerciseLibrary(), ...customExercises].filter(e => 
    e.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative pb-24">
      {/* Top Session Stats Floating Bar */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 py-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            Live Session
          </span>
          <h2 className="text-lg font-black text-white">{activeWorkout.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
            <Clock className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
          <button
            onClick={() => {
              const hasCompleted = activeWorkout.exercises.some(ex => ex.sets.some(s => s.completed));
              if (hasCompleted) {
                finishWorkout();
              } else {
                setShowFinishConfirm(true);
              }
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" /> Finish
          </button>
        </div>
      </div>

      {/* Rest Timer Banner */}
      {restSecondsLeft > 0 && (
        <Card className={`border-emerald-500/20 bg-emerald-500/5 transition-all duration-300 ${restTimerActive ? 'ring-2 ring-emerald-500/20' : ''}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
                ⏱️
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Rest Active</h3>
                <p className="text-slate-400 text-xs mt-0.5">Hydrate, breathe, and prepare for the next set.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-emerald-400 tracking-wider">
                {formatTime(restSecondsLeft)}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setRestSecondsLeft(prev => prev + 30)}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-bold rounded-lg hover:border-slate-700"
                >
                  +30s
                </button>
                <button
                  onClick={() => setRestSecondsLeft(prev => Math.max(0, prev - 30))}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-bold rounded-lg hover:border-slate-700"
                >
                  -30s
                </button>
                <button
                  onClick={() => setRestSecondsLeft(0)}
                  className="px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] text-rose-400 font-bold rounded-lg hover:border-rose-900/20 hover:text-rose-300"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Exercises List */}
      <div className="space-y-4">
        {activeWorkout.exercises.map((ex, exIdx) => (
          <Card key={`${ex.id}-${exIdx}`} className="border-slate-800 bg-slate-900/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-500">
                  Exercise {exIdx + 1} • {ex.category}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <ExerciseVisual
                    name={ex.name}
                    category={ex.category}
                    youtubeId={ex.youtubeId}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-0.5">Target: {ex.targetSets} sets × {ex.targetReps} reps</p>
              </div>
              <button
                onClick={() => removeExerciseFromWorkout(exIdx)}
                className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-400 transition-all cursor-pointer ml-2 shrink-0"
                title="Remove Exercise"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Set Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-500 uppercase font-bold text-[9px] tracking-wider">
                    <th className="py-2 px-1">Set</th>
                    <th className="py-2 px-2">Weight (kg)</th>
                    <th className="py-2 px-2">Reps</th>
                    <th className="py-2 px-2 text-center">RPE</th>
                    <th className="py-2 px-1 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {ex.sets.map((set, setIdx) => (
                    <tr
                      key={setIdx}
                      className={`transition-colors duration-150 ${set.completed ? 'bg-emerald-500/5' : ''}`}
                    >
                      <td className="py-2 px-1 font-bold text-slate-400">
                        {setIdx + 1}
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          placeholder="0"
                          value={set.weight || ''}
                          disabled={set.completed}
                          onChange={(e) => updateWorkoutSet(exIdx, setIdx, { weight: parseFloat(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 bg-slate-950 border border-slate-800/80 rounded text-center text-xs text-white focus:outline-none focus:border-emerald-500/30 disabled:opacity-50"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          placeholder="10"
                          value={set.reps || ''}
                          disabled={set.completed}
                          onChange={(e) => updateWorkoutSet(exIdx, setIdx, { reps: parseInt(e.target.value) || 0 })}
                          className="w-14 px-2 py-1 bg-slate-950 border border-slate-800/80 rounded text-center text-xs text-white focus:outline-none focus:border-emerald-500/30 disabled:opacity-50"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <select
                          value={set.rpe || ''}
                          disabled={set.completed}
                          onChange={(e) => updateWorkoutSet(exIdx, setIdx, { rpe: parseInt(e.target.value) || undefined })}
                          className="px-1.5 py-1 bg-slate-950 border border-slate-800/80 rounded text-center text-[10px] text-white focus:outline-none disabled:opacity-50"
                        >
                          <option value="">RPE</option>
                          {[10, 9, 8, 7, 6, 5].map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-1 text-right">
                        <button
                          onClick={() => handleSetToggleComplete(exIdx, setIdx, set.completed)}
                          className={`
                            h-6 w-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ml-auto
                            ${set.completed
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 hover:bg-emerald-400'
                              : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                            }
                          `}
                        >
                          ✓
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Set Modification Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800/40">
              <button
                onClick={() => addSetToExercise(exIdx)}
                className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 text-[10px] font-bold text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="h-3 w-3 text-emerald-400" /> Add Set
              </button>
              {ex.sets.length > 1 && (
                <button
                  onClick={() => removeSetFromExercise(exIdx, ex.sets.length - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 text-[10px] font-bold text-slate-400 flex items-center gap-1 transition-all cursor-pointer"
                >
                  Delete Set
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Custom Exercise to active session trigger */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowAddExerciseModal(true)}
          className="flex-1 py-3 border border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/10 rounded-2xl text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 text-emerald-400" /> Add Exercise to Workout
        </button>

        <button
          onClick={cancelWorkout}
          className="px-6 py-3 border border-slate-850 bg-slate-950/20 text-rose-400 hover:bg-rose-950/15 hover:text-rose-300 text-xs font-bold rounded-2xl transition-all cursor-pointer"
        >
          Cancel Workout
        </button>
      </div>

      {/* Confirm finish with no completed sets */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-white font-bold text-lg">No exercises completed</h3>
            <p className="text-zinc-400 text-sm">You haven&apos;t completed any sets yet. Do you want to finish this workout anyway or cancel?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Cancel Workout
              </button>
              <button
                onClick={() => { finishWorkout(); setShowFinishConfirm(false); }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-sm font-bold hover:bg-emerald-400 transition-all cursor-pointer"
              >
                Finish Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Select Exercise to Add */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/20">
              <h3 className="font-bold text-white text-sm">Add Exercise</h3>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-800/80">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search exercise..."
                  value={exerciseSearchTerm}
                  onChange={(e) => setExerciseSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2">
              {searchFilteredExercises.slice(0, 30).map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    addExerciseToWorkout(ex);
                    setShowAddExerciseModal(false);
                    setExerciseSearchTerm('');
                  }}
                  className="w-full p-3 text-left hover:bg-slate-900 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <h4 className="font-bold text-white text-xs leading-normal">{ex.name}</h4>
                    <span className="text-[9px] text-slate-500">{ex.category} • {ex.equipment}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">+ Add</span>
                </button>
              ))}
              {searchFilteredExercises.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No exercises found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
