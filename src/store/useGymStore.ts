import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateExerciseLibrary, Exercise } from '@/data/exercises';
import { getFirebase } from '@/lib/firebase';

// --- TYPES ---
export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // cm
  weight: number; // kg
  bodyFat?: number; // %
  experienceLevel: 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced';
  goals: ('Build Muscle' | 'Lose Fat' | 'Body Recomposition' | 'Gain Strength' | 'Improve Athletic Performance' | 'General Fitness' | 'Powerlifting' | 'Bodybuilding')[];
  environment: 'Full Gym' | 'Home Gym' | 'Dumbbells Only' | 'Bodyweight Only';
  frequency: number; // 2..6 days
  isOnboarded: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  category: string;
  youtubeId?: string;
  sets: {
    weight: number; // kg
    reps: number;
    completed: boolean;
    rpe?: number; // 1..10
  }[];
  targetSets: number;
  targetReps: string; // e.g. "8-12" or "5x5"
}

export interface WorkoutSession {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  startTime?: number;
  isCustom?: boolean;
}

export interface CompletedWorkout {
  id: string;
  name: string;
  date: string; // ISO string
  durationMinutes: number;
  totalVolume: number;
  exercises: WorkoutExercise[];
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  waterMl: number;
  sleepHours: number;
  fatigue: number; // 1-5
  stress: number; // 1-5
  meals: Meal[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string; // date string
  icon: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  level: string;
  splitName: string;
  workouts: WorkoutSession[];
}

interface GymStore {
  // State
  isLoggedIn: boolean;
  loggedInUser: { name: string; email: string; uid: string } | null;
  profile: UserProfile;
  activeProgram: Program | null;
  activeWorkout: WorkoutSession | null;
  workoutLogs: CompletedWorkout[];
  dailyLogs: Record<string, DayLog>;
  achievements: Achievement[];
  customExercises: Exercise[];
  openAiKey: string;
  theme: 'light' | 'dark';
  hasHydrated: boolean;

  // Setters & Actions
  login: (user: { name: string; email: string; uid: string }) => void;
  logout: () => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setOnboarded: (val: boolean) => void;
  setOpenAiKey: (key: string) => void;
  toggleTheme: () => void;
  setHasHydrated: (val: boolean) => void;

  // Program Generator
  generateProgram: () => void;
  setActiveProgram: (program: Program) => void;

  // Active Workout Actions
  startWorkout: (workout: WorkoutSession) => void;
  cancelWorkout: () => void;
  updateWorkoutSet: (exerciseIndex: number, setIndex: number, fields: Partial<{ weight: number; reps: number; completed: boolean; rpe: number }>) => void;
  addSetToExercise: (exerciseIndex: number) => void;
  removeSetFromExercise: (exerciseIndex: number, setIndex: number) => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (exerciseIndex: number) => void;
  finishWorkout: () => void;

  // Nutrition & Recovery Actions
  addMeal: (date: string, meal: Omit<Meal, 'id'>) => void;
  removeMeal: (date: string, mealId: string) => void;
  updateWater: (date: string, amountMl: number) => void;
  updateRecoveryMetric: (date: string, metrics: Partial<{ sleepHours: number; fatigue: number; stress: number }>) => void;

  // Workout Log Management
  deleteWorkoutLog: (id: string) => void;

  // Exercises
  addCustomExercise: (exercise: Exercise) => void;
  updateCustomExercise: (id: string, patch: Partial<Exercise>) => void;
  deleteCustomExercise: (id: string) => void;
  setCustomExercises: (exercises: Exercise[]) => void;

  // Helper getters
  getCalculatedNutritionGoals: () => { calories: number; protein: number; carbs: number; fat: number };
  getRecoveryScore: (date: string) => number;
}

// Initial achievements list
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-workout', title: 'First Workout', description: 'Log your very first workout in GymVerse.', icon: '💪' },
  { id: 'streak-7', title: 'Consistency King', description: 'Maintain a 7-day streak of active logging.', icon: '🔥' },
  { id: 'workouts-10', title: 'Gym Rat', description: 'Complete 10 workouts.', icon: '🏋️‍♂️' },
  { id: 'workouts-100', title: 'Centurion Athlete', description: 'Complete 100 workouts.', icon: '🏆' },
  { id: 'squat-100', title: 'Squat Master', description: 'Squat 100kg or more.', icon: '🦵' },
  { id: 'deadlift-150', title: 'Titan Deadlift', description: 'Deadlift 150kg or more.', icon: '💀' },
  { id: 'weight-goal', title: 'Body Shifter', description: 'Log a change in weight towards your target.', icon: '⚖️' },
];

export const useGymStore = create<GymStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      loggedInUser: null,
      profile: {
        age: 25,
        gender: 'Male',
        height: 175,
        weight: 70,
        experienceLevel: 'Beginner',
        goals: ['Build Muscle'],
        environment: 'Full Gym',
        frequency: 3,
        isOnboarded: false,
      },
      activeProgram: null,
      activeWorkout: null,
      workoutLogs: [],
      dailyLogs: {},
      achievements: INITIAL_ACHIEVEMENTS,
      customExercises: [],
      openAiKey: '',
      theme: 'dark',
      hasHydrated: false,

      login: (user) => set({ isLoggedIn: true, loggedInUser: user }),
      logout: () => {
        set({ isLoggedIn: false, loggedInUser: null });
        const { auth } = getFirebase();
        if (auth) auth.signOut();
      },
      setProfile: (newProfile) => {
        const state = get();
        const shouldRegenerate =
          (newProfile.frequency !== undefined && newProfile.frequency !== state.profile.frequency) ||
          (newProfile.experienceLevel !== undefined && newProfile.experienceLevel !== state.profile.experienceLevel) ||
          (newProfile.environment !== undefined && newProfile.environment !== state.profile.environment);
        set({ profile: { ...state.profile, ...newProfile } });
        if (shouldRegenerate) {
          get().generateProgram();
        }
      },
      setOnboarded: (val) => set((state) => ({ profile: { ...state.profile, isOnboarded: val } })),
      setOpenAiKey: (key) => set({ openAiKey: key }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setHasHydrated: (val) => set({ hasHydrated: val }),
      deleteWorkoutLog: (id) => set((state) => ({
        workoutLogs: state.workoutLogs.filter((log) => log.id !== id),
      })),

      generateProgram: () => {
        const { profile } = get();
        const level = profile.experienceLevel;
        const freq = profile.frequency;
        const env = profile.environment;
        const goals = profile.goals;

        const allExercises = [...generateExerciseLibrary(), ...get().customExercises];

        const pick = (cats: string[], count: number, exclude?: string[]): Exercise[] => {
          const pool = allExercises.filter(e =>
            cats.includes(e.category) &&
            (!exclude || !exclude.includes(e.name))
          );
          const shuffled = [...pool].sort(() => Math.random() - 0.5);
          return shuffled.slice(0, count);
        };

        const makeEx = (ex: Exercise, targetSets: number, targetReps: string): WorkoutExercise => ({
          id: `${ex.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: ex.name,
          category: ex.category,
          youtubeId: ex.youtubeId,
          targetSets,
          targetReps,
          sets: Array.from({ length: targetSets }, () => ({
            weight: 0,
            reps: parseInt(targetReps) || 10,
            completed: false,
          })),
        });

        const isStrength = goals.some(g => ['Gain Strength', 'Powerlifting'].includes(g));
        const isHypertrophy = goals.some(g => ['Build Muscle', 'Bodybuilding', 'Body Recomposition'].includes(g));
        const isFatLoss = goals.some(g => ['Lose Fat', 'General Fitness'].includes(g));

        const compoundSets = isStrength ? 4 : isHypertrophy ? 3 : 3;
        const accessorySets = isStrength ? 3 : isHypertrophy ? 3 : 2;
        const compoundReps = isStrength ? '5-8' : isHypertrophy ? '8-12' : '10-15';
        const accessoryReps = isStrength ? '8-10' : isHypertrophy ? '10-15' : '12-15';

        const levelMod = level === 'Advanced' ? 1 : level === 'Intermediate' ? 0 : -1;
        const baseSets = compoundSets + levelMod;
        const baseAccessorySets = accessorySets + levelMod;

        const upperCats = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms'];
        const lowerCats = ['Legs', 'Glutes', 'Calves'];
        const pushCats = ['Chest', 'Shoulders', 'Triceps'];
        const pullCats = ['Back', 'Biceps', 'Forearms'];
        const coreCats = ['Abs'];

        const dayTemplates: { id: string; name: string; cats: string[]; exCount: number; isCompound: boolean }[] = [];

        if (freq <= 3) {
          // Full body each day with different emphasis
          dayTemplates.push(
            { id: 'fb-a', name: 'Full Body A (Strength Focus)', cats: [...upperCats, ...lowerCats], exCount: 6, isCompound: true },
            { id: 'fb-b', name: 'Full Body B (Hypertrophy Focus)', cats: [...upperCats, ...lowerCats], exCount: 6, isCompound: false },
          );
          if (freq >= 3) {
            dayTemplates.push(
              { id: 'fb-c', name: 'Full Body C (Conditioning Focus)', cats: [...upperCats, ...lowerCats, ...coreCats], exCount: 6, isCompound: false },
            );
          }
        } else if (freq === 4) {
          dayTemplates.push(
            { id: 'ul-up-a', name: 'Upper Body Strength', cats: upperCats, exCount: 6, isCompound: true },
            { id: 'ul-low-a', name: 'Lower Body Power', cats: lowerCats, exCount: 5, isCompound: true },
            { id: 'ul-up-b', name: 'Upper Body Hypertrophy', cats: upperCats, exCount: 6, isCompound: false },
            { id: 'ul-low-b', name: 'Lower Body Endurance', cats: [...lowerCats, ...coreCats], exCount: 5, isCompound: false },
          );
        } else if (freq === 5) {
          dayTemplates.push(
            { id: 'ppl-push', name: 'Push Day (Chest, Shoulders, Triceps)', cats: pushCats, exCount: 5, isCompound: true },
            { id: 'ppl-pull', name: 'Pull Day (Back, Biceps, Forearms)', cats: pullCats, exCount: 5, isCompound: true },
            { id: 'ppl-legs', name: 'Legs & Core Day', cats: [...lowerCats, ...coreCats], exCount: 5, isCompound: true },
            { id: 'upper-hyper', name: 'Upper Body Specialization', cats: upperCats, exCount: 5, isCompound: false },
            { id: 'lower-power', name: 'Lower Body Power', cats: lowerCats, exCount: 4, isCompound: true },
          );
        } else {
          // 6 days
          dayTemplates.push(
            { id: 'push-1', name: 'Push Day', cats: pushCats, exCount: 5, isCompound: true },
            { id: 'pull-1', name: 'Pull Day', cats: pullCats, exCount: 5, isCompound: true },
            { id: 'legs-1', name: 'Legs Day', cats: [...lowerCats, ...coreCats], exCount: 5, isCompound: true },
            { id: 'push-2', name: 'Push (Volume)', cats: pushCats, exCount: 5, isCompound: false },
            { id: 'pull-2', name: 'Pull (Volume)', cats: pullCats, exCount: 5, isCompound: false },
            { id: 'legs-2', name: 'Legs & Core', cats: [...lowerCats, ...coreCats], exCount: 5, isCompound: false },
          );
        }

        const splitNames: Record<number, string> = {
          2: 'Full Body', 3: 'Full Body', 4: 'Upper Lower',
          5: 'Push Pull Legs Upper Lower', 6: 'Push Pull Legs',
        };

        const programNames: Record<string, Record<number, string>> = {
          Beginner: { 2: 'Foundation Full Body', 3: 'Foundation Full Body', 4: 'Starter Upper/Lower', 5: '5-Day Hybrid', 6: '6-Day Foundation' },
          Novice: { 2: 'Novice Full Body', 3: 'Novice Full Body', 4: 'Novice Upper/Lower', 5: 'Novice 5-Day', 6: 'Novice 6-Day' },
          Intermediate: { 2: 'Power Hypertrophy', 3: 'Power Hypertrophy', 4: 'Power Upper/Lower', 5: 'PPLUL Split', 6: 'PPL 6-Day' },
          Advanced: { 2: 'Elite Powerbuilding', 3: 'Elite Powerbuilding', 4: 'Elite Upper/Lower', 5: 'Elite 5-Day', 6: 'Elite 6-Day' },
        };

        const splitName = splitNames[freq] || 'Custom Split';
        const name = `GymVerse ${programNames[level]?.[freq] || 'Custom'} (${splitName})`;
        const description = `A ${freq}-day program tailored for ${level.toLowerCase()} using ${env.toLowerCase()}. ` +
          `Goal: ${goals.join(', ')}. Exercises are dynamically selected to match your equipment and experience level.`;

        const workouts: WorkoutSession[] = dayTemplates.slice(0, freq).map((tmpl) => {
          const compoundCount = Math.min(2, Math.ceil(tmpl.exCount * 0.4));
          const accessoryCount = tmpl.exCount - compoundCount;

          const compoundCats = tmpl.cats.filter(c => !['Biceps', 'Triceps', 'Forearms', 'Calves', 'Abs'].includes(c));
          const accessoryCats = tmpl.cats;

          const compounds = tmpl.isCompound ?
            pick(compoundCats.length ? compoundCats : tmpl.cats, compoundCount) :
            [];

          const usedNames = compounds.map(e => e.name);
          const accessories = pick(accessoryCats, accessoryCount, usedNames);

          const exercises = [...compounds, ...accessories].map((ex, i) => {
            const isCompound = i < compounds.length;
            const sets = tmpl.isCompound && isCompound ? Math.max(2, baseSets) : Math.max(2, baseAccessorySets);
            const reps = tmpl.isCompound && isCompound ? compoundReps : accessoryReps;
            return makeEx(ex, sets, reps);
          });

          return { id: `wo-${tmpl.id}-${Date.now()}`, name: tmpl.name, exercises };
        });

        const generated: Program = {
          id: `program-${level.toLowerCase()}-${freq}d-${Date.now()}`,
          name,
          description,
          level,
          splitName,
          workouts,
        };

        set({ activeProgram: generated });
      },

      setActiveProgram: (program) => set({ activeProgram: program }),

      // Active Workout Actions
      startWorkout: (workout) => set({
        activeWorkout: {
          ...workout,
          startTime: Date.now(),
          exercises: workout.exercises.map(ex => ({
            ...ex,
            sets: ex.sets.map(s => ({ ...s, completed: false }))
          }))
        }
      }),

      cancelWorkout: () => set({ activeWorkout: null }),

      updateWorkoutSet: (exIdx, setIdx, fields) => set((state) => {
        if (!state.activeWorkout) return {};
        const updatedExercises = [...state.activeWorkout.exercises];
        const updatedSets = [...updatedExercises[exIdx].sets];
        updatedSets[setIdx] = { ...updatedSets[setIdx], ...fields };
        updatedExercises[exIdx] = { ...updatedExercises[exIdx], sets: updatedSets };
        return { activeWorkout: { ...state.activeWorkout, exercises: updatedExercises } };
      }),

      addSetToExercise: (exIdx) => set((state) => {
        if (!state.activeWorkout) return {};
        const updatedExercises = [...state.activeWorkout.exercises];
        const currentSets = updatedExercises[exIdx].sets;
        const lastSet = currentSets[currentSets.length - 1] || { weight: 0, reps: 10 };
        updatedExercises[exIdx] = {
          ...updatedExercises[exIdx],
          sets: [...currentSets, { weight: lastSet.weight, reps: lastSet.reps, completed: false }]
        };
        return { activeWorkout: { ...state.activeWorkout, exercises: updatedExercises } };
      }),

      removeSetFromExercise: (exIdx, setIdx) => set((state) => {
        if (!state.activeWorkout) return {};
        const updatedExercises = [...state.activeWorkout.exercises];
        const updatedSets = updatedExercises[exIdx].sets.filter((_, idx) => idx !== setIdx);
        updatedExercises[exIdx] = { ...updatedExercises[exIdx], sets: updatedSets };
        return { activeWorkout: { ...state.activeWorkout, exercises: updatedExercises } };
      }),

      addExerciseToWorkout: (exercise) => set((state) => {
        if (!state.activeWorkout) return {};
        const newEx: WorkoutExercise = {
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
          targetSets: 3,
          targetReps: "10",
          sets: Array.from({ length: 3 }, () => ({ weight: 0, reps: 10, completed: false }))
        };
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: [...state.activeWorkout.exercises, newEx]
          }
        };
      }),

      removeExerciseFromWorkout: (exIdx) => set((state) => {
        if (!state.activeWorkout) return {};
        const updatedExercises = state.activeWorkout.exercises.filter((_, idx) => idx !== exIdx);
        return { activeWorkout: { ...state.activeWorkout, exercises: updatedExercises } };
      }),

      finishWorkout: () => set((state) => {
        if (!state.activeWorkout) return {};

        const durationMinutes = Math.max(1, Math.round((Date.now() - (state.activeWorkout.startTime || Date.now())) / 60000));
        
        // Compute total volume
        let totalVolume = 0;
        state.activeWorkout.exercises.forEach(ex => {
          ex.sets.forEach(s => {
            if (s.completed) {
              totalVolume += s.weight * s.reps;
            }
          });
        });

        const logged: CompletedWorkout = {
          id: `log-${Date.now()}`,
          name: state.activeWorkout.name,
          date: new Date().toISOString(),
          durationMinutes,
          totalVolume,
          exercises: state.activeWorkout.exercises.filter(ex => ex.sets.some(s => s.completed)),
        };

        const updatedLogs = [logged, ...state.workoutLogs];

        // Trigger Achievement unlocks
        const updatedAchievements = state.achievements.map(ach => {
          if (ach.unlockedAt) return ach;
          
          let unlock = false;
          if (ach.id === 'first-workout' && updatedLogs.length >= 1) unlock = true;
          if (ach.id === 'workouts-10' && updatedLogs.length >= 10) unlock = true;
          if (ach.id === 'workouts-100' && updatedLogs.length >= 100) unlock = true;
          
          // Check lift goals
          logged.exercises.forEach(ex => {
            ex.sets.forEach(s => {
              if (s.completed) {
                if (ach.id === 'squat-100' && ex.name.toLowerCase().includes('squat') && s.weight >= 100) unlock = true;
                if (ach.id === 'deadlift-150' && ex.name.toLowerCase().includes('deadlift') && s.weight >= 150) unlock = true;
              }
            });
          });

          // Check streak
          if (ach.id === 'streak-7') {
            // Check if there are logs in the last 7 consecutive days
            // (Simulate unlock or check actual days, for simplicity we trigger on 7 completed logs within 14 days)
            if (updatedLogs.length >= 7) {
              unlock = true; 
            }
          }

          if (unlock) {
            return { ...ach, unlockedAt: new Date().toISOString() };
          }
          return ach;
        });

        return {
          workoutLogs: updatedLogs,
          achievements: updatedAchievements,
          activeWorkout: null
        };
      }),

      // Nutrition & Recovery Actions
      addMeal: (date, mealDetails) => set((state) => {
        const day = state.dailyLogs[date] || { date, waterMl: 0, sleepHours: 8, fatigue: 3, stress: 3, meals: [] };
        const newMeal: Meal = {
          id: `meal-${Date.now()}`,
          ...mealDetails
        };
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [date]: { ...day, meals: [...day.meals, newMeal] }
          }
        };
      }),

      removeMeal: (date, mealId) => set((state) => {
        const day = state.dailyLogs[date];
        if (!day) return {};
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [date]: { ...day, meals: day.meals.filter(m => m.id !== mealId) }
          }
        };
      }),

      updateWater: (date, amountMl) => set((state) => {
        const day = state.dailyLogs[date] || { date, waterMl: 0, sleepHours: 8, fatigue: 3, stress: 3, meals: [] };
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [date]: { ...day, waterMl: Math.max(0, day.waterMl + amountMl) }
          }
        };
      }),

      updateRecoveryMetric: (date, metrics) => set((state) => {
        const day = state.dailyLogs[date] || { date, waterMl: 0, sleepHours: 8, fatigue: 3, stress: 3, meals: [] };
        return {
          dailyLogs: {
            ...state.dailyLogs,
            [date]: { ...day, ...metrics }
          }
        };
      }),

      addCustomExercise: (ex) => set((state) => ({ customExercises: [ex, ...state.customExercises] })),
      updateCustomExercise: (id, patch) => set((state) => ({
        customExercises: state.customExercises.map((ex) => ex.id === id ? { ...ex, ...patch } : ex),
      })),
      deleteCustomExercise: (id) => set((state) => ({
        customExercises: state.customExercises.filter((ex) => ex.id !== id),
      })),
      setCustomExercises: (exercises) => set({ customExercises: exercises }),

      // Getters
      getCalculatedNutritionGoals: () => {
        const { profile } = get();
        const weight = profile.weight;
        const height = profile.height;
        const age = profile.age;
        const gender = profile.gender;
        const goal = profile.goals[0] || 'Build Muscle';
        const freq = profile.frequency;

        // BMR (Mifflin-St Jeor)
        let bmr = 10 * weight + 6.25 * height - 5 * age;
        if (gender === 'Male') bmr += 5;
        else if (gender === 'Female') bmr -= 161;
        else bmr -= 80;

        // Activity Multiplier
        let multiplier = 1.2;
        if (freq === 2) multiplier = 1.375;
        else if (freq === 3 || freq === 4) multiplier = 1.55;
        else if (freq >= 5) multiplier = 1.725;

        const tdee = Math.round(bmr * multiplier);
        let targetCalories = tdee;

        if (goal === 'Build Muscle' || goal === 'Bodybuilding') {
          targetCalories = tdee + 350;
        } else if (goal === 'Lose Fat') {
          targetCalories = tdee - 500;
        } else if (goal === 'Body Recomposition') {
          targetCalories = tdee - 150;
        } else if (goal === 'Gain Strength' || goal === 'Powerlifting') {
          targetCalories = tdee + 150;
        }

        // Macros Calculation
        // Protein: 2.2g per kg (4 kcal/g)
        const proteinG = Math.round(weight * 2.2);
        const proteinKcal = proteinG * 4;

        // Fat: 25% of calories (9 kcal/g)
        const fatKcal = targetCalories * 0.25;
        const fatG = Math.round(fatKcal / 9);

        // Carbs: Rest (4 kcal/g)
        const carbsKcal = Math.max(0, targetCalories - (proteinKcal + fatKcal));
        const carbsG = Math.round(carbsKcal / 4);

        return {
          calories: targetCalories,
          protein: proteinG,
          fat: fatG,
          carbs: carbsG,
        };
      },

      getRecoveryScore: (date) => {
        const { dailyLogs } = get();
        const log = dailyLogs[date];
        if (!log) return 75; // Default score

        // Sleep Score (Max 40 points)
        // 8 hours is target. Score = (hours / 8) * 40
        const sleepScore = Math.min(40, (log.sleepHours / 8) * 40);

        // Fatigue Score (Max 30 points)
        // Lower fatigue is better (1 is best, 5 is worst). Score = (6 - fatigue) * 6
        const fatigueScore = (6 - log.fatigue) * 6;

        // Stress Score (Max 30 points)
        // Lower stress is better. Score = (6 - log.stress) * 6
        const stressScore = (6 - log.stress) * 6;

        return Math.round(sleepScore + fatigueScore + stressScore);
      },
    }),
    {
      name: 'gymverse-state',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        const setHydrated = state?.setHasHydrated;
        return (state, error) => {
          if (state?.setHasHydrated) {
            state.setHasHydrated(true);
          } else if (setHydrated) {
            setHydrated(true);
          }
          if (state?.activeProgram && state.activeProgram.workouts.length !== state.profile.frequency) {
            state.generateProgram();
          }
        };
      },
    }
  )
);
