import React, { useState, useMemo } from 'react';
import { Search, X, Video, AlertTriangle, HelpCircle, RefreshCw, Star, Play } from 'lucide-react';
import { generateExerciseLibrary, Exercise } from '@/data/exercises';
import { useGymStore } from '@/store/useGymStore';
import { Card } from './Card';
import { ExerciseVisual } from './ExerciseVisual';
import { VideoModal } from './VideoModal';

export const ExerciseLibrary: React.FC = () => {
  const customExercises = useGymStore((s) => s.customExercises);
  const allExercises = useMemo(() => [...generateExerciseLibrary(), ...customExercises], [customExercises]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Categories list
  const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Abs', 'Legs', 'Glutes', 'Calves', 'Neck', 'Cardio', 'Mobility'];
  // Equipment list
  const equipments = ['All', 'Barbell', 'Dumbbells', 'Cable', 'Machine', 'Bodyweight', 'Kettlebell', 'Bands', 'Full Gym'];
  // Difficulty list
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return allExercises.filter(ex => {
      const matchSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.musclesWorked.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = selectedCategory === 'All' || ex.category === selectedCategory;
      const matchEquip = selectedEquipment === 'All' || ex.equipment === selectedEquipment;
      const matchDiff = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
      return matchSearch && matchCat && matchEquip && matchDiff;
    });
  }, [allExercises, searchTerm, selectedCategory, selectedEquipment, selectedDifficulty]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400">📚</span> Exercise Encyclopedia
          </h2>
          <p className="text-slate-400 text-sm mt-1">Explore over 500 detailed exercises with full guides and dynamic alternatives.</p>
        </div>
        <div className="text-slate-400 text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/50">
          Showing <span className="text-emerald-400 font-bold">{filteredExercises.length}</span> of {allExercises.length} exercises
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-950/80 border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercise or muscle group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 text-sm transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Equipment Selector */}
          <div>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
            >
              <option value="All">All Equipment</option>
              {equipments.filter(e => e !== 'All').map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Selector */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
            >
              <option value="All">All Levels</option>
              {difficulties.filter(d => d !== 'All').map(df => (
                <option key={df} value={df}>{df}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Badges horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pt-4 pb-2 no-scrollbar border-t border-slate-800/50 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer
                ${selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-905 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Grid of Exercises */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.slice(0, 48).map((ex) => (
            <Card
              key={ex.id}
              hoverable
              onClick={() => setActiveExercise(ex)}
              className="p-0 border-slate-800/80 cursor-pointer hover:scale-[1.01] flex flex-col bg-slate-900/40 overflow-hidden rounded-2xl"
            >
              <div className="w-full bg-black/30">
                <ExerciseVisual
                  name={ex.name}
                  category={ex.category}
                  youtubeId={ex.youtubeId}
                  size="lg"
                  showName={false}
                  className="w-full"
                />
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full truncate">
                      {ex.category}
                    </span>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border shrink-0
                      ${ex.difficulty === 'Beginner' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        ex.difficulty === 'Intermediate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-rose-500/10 border-rose-500/20 text-rose-400'}
                    `}>
                      {ex.difficulty}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug">{ex.name}</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">{ex.equipment}</p>
                  </div>
                  {ex.musclesWorked.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ex.musclesWorked.slice(0, 2).map((m) => (
                        <span key={m} className="text-[9px] bg-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                      {ex.musclesWorked.length > 2 && (
                        <span className="text-[9px] text-slate-600 self-center">+{ex.musclesWorked.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="pt-2.5 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500 group">
                  <span className="text-[11px]">View Details</span>
                  <span className="text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            </Card>
          ))}
          {filteredExercises.length > 48 && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-4 text-xs text-slate-500">
              Only showing first 48 matches. Refine search to see other exercises.
            </div>
          )}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed border-slate-800 bg-slate-950/20">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-white font-bold text-lg">No Exercises Found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">We couldn&apos;t find any exercises matching your combination of search query and filters. Try clearing some selections.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedEquipment('All');
              setSelectedDifficulty('All');
            }}
            className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </Card>
      )}

      {/* Exercise Details Overlay Drawer/Modal */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-0 md:p-4 animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-default" onClick={() => setActiveExercise(null)} />
          
          <div className="relative z-10 w-full max-w-2xl h-full md:h-[95vh] bg-slate-950 border-l border-slate-800 md:border md:rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/60 flex items-start justify-between bg-slate-900/40">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    {activeExercise.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {activeExercise.equipment}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{activeExercise.name}</h2>
              </div>
              <button
                onClick={() => setActiveExercise(null)}
                className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Exercise Visual Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4 text-emerald-400" /> Exercise Preview
                </h3>
                <div className="rounded-xl overflow-hidden bg-black/60 border border-slate-800">
                  <ExerciseVisual
                    name={activeExercise.name}
                    category={activeExercise.category}
                    youtubeId={activeExercise.youtubeId}
                    size="lg"
                    className="w-full"
                  />
                </div>
                {activeExercise.youtubeId && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-all cursor-pointer"
                  >
                    <Play size={16} fill="currentColor" /> Watch Video Demo
                  </button>
                )}
              </div>

              {/* Grid: Muscles and Mechanics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Muscles Targeted</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeExercise.musclesWorked.map((m, idx) => (
                      <span key={m} className={`px-2.5 py-1 rounded text-xs font-semibold ${idx === 0 ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                        {m} {idx === 0 && '(Primary)'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mechanics Summary</h4>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-400">Target Group: <span className="text-white font-semibold">{activeExercise.targetMuscleGroup}</span></p>
                    <p className="text-slate-400">Difficulty: <span className="text-white font-semibold">{activeExercise.difficulty}</span></p>
                    <p className="text-slate-400">Equipment: <span className="text-white font-semibold">{activeExercise.equipment}</span></p>
                  </div>
                </div>
              </div>

              {/* Movement Mechanics details */}
              <div className="space-y-3 p-4 rounded-xl border border-slate-800/80 bg-slate-900/10">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-emerald-400" /> Movement Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-500">Starting Position</p>
                    <p className="text-slate-300 leading-relaxed font-medium">{activeExercise.startPosition}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Ending Position</p>
                    <p className="text-slate-300 leading-relaxed font-medium">{activeExercise.endPosition}</p>
                  </div>
                  <div className="md:col-span-2 space-y-1 border-t border-slate-800/60 pt-2 mt-2">
                    <p className="text-slate-500">Range of Motion & Path</p>
                    <p className="text-slate-300 leading-relaxed font-medium">{activeExercise.rangeOfMotion}</p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-emerald-400" /> Step-by-Step Guide
                </h3>
                <ol className="space-y-3">
                  {activeExercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                      <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-emerald-400">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Common Mistakes & Form Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-red-950/40 bg-red-950/10 space-y-2">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-red-500" /> Common Mistakes
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {activeExercise.commonMistakes.map((mis, idx) => (
                      <li key={idx} className="leading-snug">{mis}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-950/40 bg-emerald-950/10 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-emerald-500" /> Professional Form Tips
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {activeExercise.formTips.map((tip, idx) => (
                      <li key={idx} className="leading-snug">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Breathing & Injury Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/10 text-xs">
                  <h4 className="font-bold text-slate-400 mb-1">Breathing Instructions</h4>
                  <p className="text-slate-300 leading-relaxed">{activeExercise.breathing}</p>
                </div>
                <div className="p-4 rounded-xl border border-rose-950/40 bg-rose-950/10 text-xs">
                  <h4 className="font-bold text-rose-400 mb-1">Injury Risks & Safety</h4>
                  <p className="text-slate-300 leading-relaxed">{activeExercise.injuryRisks.join(' ')}</p>
                </div>
              </div>

              {/* Alternatives */}
              {activeExercise.alternatives.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 text-emerald-400" /> Suggested Alternatives
                  </h4>
                  <div className="flex gap-2">
                    {activeExercise.alternatives.map((alt) => (
                      <button
                        key={alt}
                        onClick={() => {
                          const matchingEx = allExercises.find(e => e.name.toLowerCase() === alt.toLowerCase());
                          if (matchingEx) {
                            setActiveExercise(matchingEx);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-all cursor-pointer"
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t border-slate-800/60 bg-slate-900/40 flex justify-between items-center">
              {activeExercise.youtubeId && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Play size={14} fill="currentColor" /> Watch Video Demo
                </button>
              )}
              <button
                onClick={() => setActiveExercise(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer ml-auto"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
      {showVideo && activeExercise?.youtubeId && (
        <VideoModal
          youtubeId={activeExercise.youtubeId}
          exerciseName={activeExercise.name}
          onClose={() => setShowVideo(false)}
        />
      )}
    </div>
  );
};
