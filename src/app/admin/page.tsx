'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Save, Plus, Trash2, RotateCcw, ExternalLink, LogIn, LogOut, Shield, Eye, EyeOff, Lock, Image as ImageIcon, Video, AlertTriangle, HelpCircle, Star, ArrowLeft, Dumbbell } from 'lucide-react';
import { generateExerciseLibrary, Exercise } from '@/data/exercises';
import {
  getAllExercises, saveExerciseEdit, addCustomExercise,
  updateCustomExercise, deleteCustomExercise, resetEdit,
  verifyPin, changePin, isCustomExercise, isEdited,
  getCustomExercises,
} from '@/data/customExercises';
import { useGymStore } from '@/store/useGymStore';
import { getExerciseGif, getExerciseImage } from '@/data/exerciseImages';
import { getFirebase } from '@/lib/firebase';

const ADMIN_EMAIL = 'sheikh.fahad327@gmail.com';

const categories = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Abs', 'Legs', 'Glutes', 'Calves', 'Neck', 'Cardio', 'Mobility'];
const equipments = ['Barbell', 'Dumbbells', 'Cable', 'Machine', 'Bodyweight', 'Kettlebell', 'Bands', 'Full Gym'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

function extractYoutubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return url;
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Shield size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Admin Panel</h1>
            <p className="text-zinc-500 text-xs">Enter PIN to access</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (verifyPin(pin)) {
              onLogin();
            } else {
              setError(true);
              setPin('');
            }
          }}
        >
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="Enter admin PIN"
              className="w-full pl-10 pr-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 text-sm"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-xs mt-2">Invalid PIN. Try again.</p>}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            <LogIn size={14} className="inline mr-1.5" /> Sign In
          </button>
        </form>
        <div className="mt-4 space-y-2">
          <p className="text-zinc-600 text-[10px] text-center">Default PIN: <code className="text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">admin</code></p>
          <p className="text-zinc-600 text-[10px] text-center">
            Or{' '}
            <a href="/" className="text-emerald-400 hover:text-emerald-300 underline">sign in with admin email</a>
            {' '}on the main page.
          </p>
        </div>
      </div>
    </div>
  );
}

function ArrayEditor({ label, values, onChange, icon }: { label: string; values: string[]; onChange: (v: string[]) => void; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">{icon}{label}</label>
      <div className="space-y-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 px-3 py-1.5 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...values, ''])}
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          + Add item
        </button>
      </div>
    </div>
  );
}

function ExerciseForm({ exercise, onChange, onSave, onReset, isCustom, isNew }: {
  exercise: Exercise;
  onChange: (e: Exercise) => void;
  onSave: () => void;
  onReset?: () => void;
  isCustom: boolean;
  isNew: boolean;
}) {
  const set = (patch: Partial<Exercise>) => onChange({ ...exercise, ...patch });

  const gifUrl = getExerciseGif(exercise.name);
  const imgUrl = getExerciseImage(exercise.name);

  return (
    <div className="space-y-5 overflow-y-auto max-h-[70vh] pr-1">
      <div className="flex gap-3 items-start">
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Exercise Name</label>
            <input
              value={exercise.name}
              onChange={(e) => set({ name: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Category</label>
              <select
                value={exercise.category}
                onChange={(e) => set({ category: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Equipment</label>
              <select
                value={exercise.equipment}
                onChange={(e) => set({ equipment: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none"
              >
                {equipments.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Difficulty</label>
              <select
                value={exercise.difficulty}
                onChange={(e) => set({ difficulty: e.target.value as Exercise['difficulty'] })}
                className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none"
              >
                {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/60 border border-zinc-700 relative">
            {(gifUrl || imgUrl) ? (
              <img
                src={gifUrl || imgUrl}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <ImageIcon size={24} className="text-zinc-600" />
            </div>
          </div>
          <p className="text-[9px] text-zinc-600 text-center mt-1">Uses name-based mapping</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
            <Video size={12} /> YouTube URL / ID
          </label>
          <input
            value={exercise.youtubeId}
            onChange={(e) => {
              const val = e.target.value;
              const id = val.includes('youtube') || val.includes('youtu.be') ? extractYoutubeId(val) : val;
              set({ youtubeId: id });
            }}
            placeholder="Video ID or full URL"
            className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/50"
          />
          {exercise.youtubeId && (
            <a
              href={`https://www.youtube.com/watch?v=${exercise.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-1"
            >
              <ExternalLink size={10} /> Watch on YouTube
            </a>
          )}
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
            <ImageIcon size={12} /> Target Muscle Group
          </label>
          <input
            value={exercise.targetMuscleGroup}
            onChange={(e) => set({ targetMuscleGroup: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Muscles Worked</label>
        <div className="flex flex-wrap gap-1.5">
          {exercise.musclesWorked.map((m, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">
              {m}
              <button onClick={() => set({ musclesWorked: exercise.musclesWorked.filter((_, j) => j !== i) })} className="text-zinc-500 hover:text-red-400 cursor-pointer">
                <X size={10} />
              </button>
            </span>
          ))}
          <button
            onClick={() => set({ musclesWorked: [...exercise.musclesWorked, ''] })}
            className="px-2 py-0.5 border border-dashed border-zinc-700 rounded text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
          >
            + Add
          </button>
        </div>
        {exercise.musclesWorked.includes('') && (
          <div className="mt-1">
            <input
              value={exercise.musclesWorked[exercise.musclesWorked.length - 1]}
              onChange={(e) => {
                const next = [...exercise.musclesWorked];
                next[next.length - 1] = e.target.value;
                set({ musclesWorked: next });
              }}
              placeholder="Type new muscle..."
              className="w-full px-2 py-1 bg-zinc-800/80 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 pt-4 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <HelpCircle size={12} className="text-emerald-400" />
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Instructions</label>
          </div>
          <ArrayEditor label="" values={exercise.instructions} onChange={(v) => set({ instructions: v })} />
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle size={12} className="text-red-400" />
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Common Mistakes</label>
          </div>
          <ArrayEditor label="" values={exercise.commonMistakes} onChange={(v) => set({ commonMistakes: v })} />
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle size={12} className="text-rose-400" />
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Injury Risks</label>
          </div>
          <ArrayEditor label="" values={exercise.injuryRisks} onChange={(v) => set({ injuryRisks: v })} />
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Star size={12} className="text-emerald-400" />
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Form Tips</label>
          </div>
          <ArrayEditor label="" values={exercise.formTips} onChange={(v) => set({ formTips: v })} />
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Alternatives</label>
          <ArrayEditor label="" values={exercise.alternatives} onChange={(v) => set({ alternatives: v })} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Breathing Instructions</label>
          <input
            value={exercise.breathing}
            onChange={(e) => set({ breathing: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-zinc-800 pt-4">
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Movement Details</h4>
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Starting Position</label>
          <input
            value={exercise.startPosition}
            onChange={(e) => set({ startPosition: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Ending Position</label>
          <input
            value={exercise.endPosition}
            onChange={(e) => set({ endPosition: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Range of Motion</label>
          <input
            value={exercise.rangeOfMotion}
            onChange={(e) => set({ rangeOfMotion: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-zinc-800">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Save size={14} /> {isNew ? 'Create Exercise' : 'Save Changes'}
        </button>
        {!isNew && !isCustom && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs transition-all cursor-pointer"
          >
            <RotateCcw size={12} /> Reset to Original
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPinSettings, setShowPinSettings] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [previewGifUrl, setPreviewGifUrl] = useState('');

  useEffect(() => {
    if (authenticated) setExercises(getAllExercises());
  }, [authenticated]);

  useEffect(() => {
    const { auth } = getFirebase();
    if (!auth) return;
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.email?.toLowerCase() === ADMIN_EMAIL) {
          setAuthenticated(true);
        }
      });
    });
  }, []);

  function refresh() {
    setExercises(getAllExercises());
    useGymStore.getState().setCustomExercises(getCustomExercises());
  }

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.equipment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || ex.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [exercises, searchTerm, selectedCategory]);

  function openEditor(ex: Exercise) {
    setEditExercise({ ...ex });
    setIsNew(false);
    setPreviewGifUrl(getExerciseGif(ex.name) || getExerciseImage(ex.name) || '');
  }

  function createNew() {
    const id = `custom-${Date.now()}`;
    const blank: Exercise = {
      id,
      name: '',
      category: 'Chest',
      equipment: 'Barbell',
      difficulty: 'Beginner',
      musclesWorked: [],
      targetMuscleGroup: '',
      instructions: [''],
      commonMistakes: [''],
      injuryRisks: [''],
      formTips: [''],
      breathing: '',
      alternatives: [],
      youtubeId: '',
      startPosition: '',
      endPosition: '',
      rangeOfMotion: '',
    };
    setEditExercise(blank);
    setIsNew(true);
    setPreviewGifUrl('');
  }

  function saveEdit() {
    if (!editExercise) return;
    if (isNew) {
      addCustomExercise(editExercise);
    } else if (isCustomExercise(editExercise.id)) {
      updateCustomExercise(editExercise.id, editExercise);
    } else {
      saveExerciseEdit(editExercise.id, editExercise);
    }
    refresh();
    setEditExercise(null);
    setIsNew(false);
  }

  function handleDelete(id: string) {
    deleteCustomExercise(id);
    refresh();
    if (editExercise?.id === id) setEditExercise(null);
  }

  function handleReset(id: string) {
    resetEdit(id);
    refresh();
    if (editExercise?.id === id) {
      const allExercises = generateExerciseLibrary();
      const original = allExercises.find((e) => e.id === id);
      if (original) setEditExercise({ ...original });
    }
  }

  function handlePinChange() {
    if (newPin !== newPinConfirm) return;
    if (newPin.length < 3) return;
    changePin(newPin);
    setPinChangeSuccess(true);
    setTimeout(() => setPinChangeSuccess(false), 2000);
    setNewPin('');
    setNewPinConfirm('');
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </a>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" />
              <h1 className="text-white font-bold text-sm">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-zinc-500">
              {exercises.length} exercises
              <span className="mx-1">·</span>
              {getCustomExercises().length} custom
            </div>
            <button
              onClick={() => setShowPinSettings(!showPinSettings)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-all cursor-pointer"
            >
              <Lock size={12} className="inline mr-1" /> PIN
            </button>
            <button
              onClick={() => {
                setAuthenticated(false);
                const { auth } = getFirebase();
                if (auth) auth.signOut();
              }}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition-all cursor-pointer"
            >
              <LogOut size={12} className="inline mr-1" /> Sign Out
            </button>
          </div>
        </div>
        {showPinSettings && (
          <div className="max-w-7xl mx-auto px-4 pb-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3 flex-wrap">
              <label className="text-xs text-zinc-400">Change PIN:</label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="New PIN (min 3 chars)"
                className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500/50 w-40"
              />
              <input
                type="password"
                value={newPinConfirm}
                onChange={(e) => setNewPinConfirm(e.target.value)}
                placeholder="Confirm PIN"
                className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500/50 w-40"
              />
              <button
                onClick={handlePinChange}
                disabled={!newPin || newPin !== newPinConfirm || newPin.length < 3}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                Update
              </button>
              {pinChangeSuccess && <span className="text-emerald-400 text-xs">PIN updated!</span>}
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={createNew}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus size={16} /> New Exercise
          </button>
        </div>

        {/* Exercise List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((ex) => {
            const custom = isCustomExercise(ex.id);
            const edited = isEdited(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => openEditor(ex)}
                className="text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-zinc-800 relative">
                    <img
                      src={getExerciseGif(ex.name) || getExerciseImage(ex.name) || ''}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <ImageIcon size={16} className="text-zinc-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-white text-sm font-semibold truncate">{ex.name}</h3>
                      {custom && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">NEW</span>}
                      {edited && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">EDITED</span>}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{ex.category} · {ex.equipment}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{ex.youtubeId ? <><Video size={10} className="inline mr-0.5" />Has video</> : 'No video'}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-sm">No exercises match your filters</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4">
          <div
            className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 shrink-0">
              <h2 className="text-white font-bold text-sm truncate pr-4">
                {isNew ? 'New Exercise' : `Edit: ${editExercise.name}`}
              </h2>
              <div className="flex items-center gap-2">
                {!isNew && isCustomExercise(editExercise.id) && (
                  <button
                    onClick={() => { handleDelete(editExercise.id); }}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setEditExercise(null)}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ExerciseForm
                exercise={editExercise}
                onChange={setEditExercise}
                onSave={saveEdit}
                onReset={() => handleReset(editExercise.id)}
                isCustom={isCustomExercise(editExercise.id)}
                isNew={isNew}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
