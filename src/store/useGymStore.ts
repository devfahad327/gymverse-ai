import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateExerciseLibrary, Exercise } from '@/data/exercises';

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
  loggedInUser: { name: string; email: string } | null;
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
  login: (user: { name: string; email: string }) => void;
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
      logout: () => set({ isLoggedIn: false, loggedInUser: null }),
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

        let name = '';
        let splitName = '';
        let description = '';
        let workouts: WorkoutSession[] = [];

        const allExercises = [...generateExerciseLibrary(), ...get().customExercises];
        const getExerciseByName = (n: string): Exercise => {
          return allExercises.find(e => e.name.toLowerCase() === n.toLowerCase()) || allExercises[0];
        };

        const mapToWorkoutExercise = (name: string, targetSets: number, targetReps: string): WorkoutExercise => {
          const ex = getExerciseByName(name);
          return {
            id: ex.id,
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
          };
        };

        // --- BEGINNER / NOVICE ---
        if (level === 'Beginner' || level === 'Novice') {
          if (freq <= 3) {
            splitName = 'Full Body';
            name = 'GymVerse Foundation Full Body';
            description = 'A full body split optimized for beginners to master form, build base strength, and establish a gym habit.';
            workouts = [
              {
                id: 'fb-a', name: 'Full Body A (Squat Focus)',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 3, '8-10'),
                  mapToWorkoutExercise('Barbell Bench Press', 3, '8-10'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 3, '8-10'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 2, '12-15'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 2, '10-12'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 2, '15'),
                ]
              },
              {
                id: 'fb-b', name: 'Full Body B (Deadlift Focus)',
                exercises: [
                  mapToWorkoutExercise('Barbell Deadlift', 3, '5'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '8-10'),
                  mapToWorkoutExercise('Pull-Up', 3, 'Max'),
                  mapToWorkoutExercise('Dumbbell Romanian Deadlift', 2, '10-12'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 2, '10-12'),
                  mapToWorkoutExercise('Deep Squat Hold (Decompression)', 1, '1 min'),
                ]
              }
            ];
          } else if (freq === 4) {
            splitName = 'Upper Lower';
            name = 'GymVerse Starter Upper/Lower';
            description = 'A 4-day split separating upper and lower body to increase focus and recover efficiently.';
            workouts = [
              {
                id: 'ul-upper-a', name: 'Upper Body A',
                exercises: [
                  mapToWorkoutExercise('Barbell Bench Press', 3, '8-10'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 3, '8-10'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '8-10'),
                  mapToWorkoutExercise('Pull-Up', 2, 'Max'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 2, '10-12'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 2, '10-12'),
                ]
              },
              {
                id: 'ul-lower-a', name: 'Lower Body A',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 3, '8-10'),
                  mapToWorkoutExercise('Dumbbell Romanian Deadlift', 3, '10-12'),
                  mapToWorkoutExercise('Barbell Hip Thrust', 2, '10-12'),
                  mapToWorkoutExercise('Standing Calf Raise', 3, '12-15'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 2, '15'),
                ]
              }
            ];
          } else {
            // 5 or 6 days — Upper/Lower Push/Pull to avoid boredom
            splitName = 'Upper Lower Push Pull';
            name = 'GymVerse 5-Day Full Body Mix';
            description = 'A 5-day rotation mixing upper, lower, push, and pull days to keep workouts fresh while building consistent habits.';
            workouts = [
              {
                id: 'beg-upper', name: 'Upper Body Strength',
                exercises: [
                  mapToWorkoutExercise('Barbell Bench Press', 3, '8-10'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 3, '8-10'),
                  mapToWorkoutExercise('Incline Dumbbell Press', 2, '10-12'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 2, '12-15'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 2, '10-12'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 2, '10-12'),
                ]
              },
              {
                id: 'beg-lower', name: 'Lower Body Strength',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 3, '8-10'),
                  mapToWorkoutExercise('Dumbbell Romanian Deadlift', 3, '10-12'),
                  mapToWorkoutExercise('Walking Lunges', 2, '10-12'),
                  mapToWorkoutExercise('Standing Calf Raise', 3, '12-15'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 2, '15'),
                ]
              },
              {
                id: 'beg-push', name: 'Push Day (Chest, Shoulders, Triceps)',
                exercises: [
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '8-10'),
                  mapToWorkoutExercise('Incline Dumbbell Press', 3, '8-12'),
                  mapToWorkoutExercise('Standing Cable Fly', 2, '12-15'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 2, '12-15'),
                  mapToWorkoutExercise('EZ-Bar Skull Crusher', 2, '10-12'),
                ]
              },
              {
                id: 'beg-pull', name: 'Pull Day (Back, Biceps)',
                exercises: [
                  mapToWorkoutExercise('Barbell Deadlift', 3, '5'),
                  mapToWorkoutExercise('Pull-Up', 3, 'Max'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 3, '8-10'),
                  mapToWorkoutExercise('Incline Dumbbell Bicep Curl', 2, '10-12'),
                  mapToWorkoutExercise('Barbell Wrist Curl', 2, '15'),
                ]
              },
              {
                id: 'beg-full', name: 'Full Body Finisher',
                exercises: [
                  mapToWorkoutExercise('Goblet Squat', 3, '10-12'),
                  mapToWorkoutExercise('Incline Dumbbell Press', 3, '10-12'),
                  mapToWorkoutExercise('Single-Arm Dumbbell Row', 3, '10-12'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 2, '12-15'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 2, '15'),
                ]
              }
            ];
          }

        // --- INTERMEDIATE ---
        } else if (level === 'Intermediate') {
          if (freq <= 4) {
            splitName = 'Upper Lower';
            name = 'GymVerse Power-Hypertrophy Split';
            description = 'A 4-day schedule alternating Heavy Power Days and Higher-Rep Hypertrophy Days for balanced strength and muscle gain.';
            workouts = [
              {
                id: 'ph-power-up', name: 'Power Upper Body',
                exercises: [
                  mapToWorkoutExercise('Barbell Bench Press', 4, '5'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 4, '5'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '6'),
                  mapToWorkoutExercise('Pull-Up', 3, 'Weighted'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 3, '8'),
                ]
              },
              {
                id: 'ph-power-low', name: 'Power Lower Body',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 4, '5'),
                  mapToWorkoutExercise('Barbell Deadlift', 3, '5'),
                  mapToWorkoutExercise('Barbell Hip Thrust', 3, '8'),
                  mapToWorkoutExercise('Standing Calf Raise', 4, '10'),
                ]
              }
            ];
          } else if (freq === 5) {
            splitName = 'PPLUL (Push Pull Legs Upper Lower)';
            name = 'GymVerse PPLUL 5-Day Split';
            description = 'A scientifically-proven 5-day rotation hitting each muscle group twice per week with balanced push, pull, legs, upper, and lower sessions.';
            workouts = [
              {
                id: 'pplul-push', name: 'Push Day (Chest, Shoulders, Triceps)',
                exercises: [
                  mapToWorkoutExercise('Barbell Bench Press', 4, '6-8'),
                  mapToWorkoutExercise('Incline Dumbbell Press', 3, '8-12'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '8-10'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 4, '12-15'),
                  mapToWorkoutExercise('Standing Cable Fly', 3, '12-15'),
                  mapToWorkoutExercise('EZ-Bar Skull Crusher', 3, '10-12'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 3, '12-15'),
                ]
              },
              {
                id: 'pplul-pull', name: 'Pull Day (Back, Biceps)',
                exercises: [
                  mapToWorkoutExercise('Bent-Over Barbell Row', 4, '6-8'),
                  mapToWorkoutExercise('Pull-Up', 4, 'Max'),
                  mapToWorkoutExercise('Seated Cable Row', 3, '10-12'),
                  mapToWorkoutExercise('Face Pulls', 3, '12-15'),
                  mapToWorkoutExercise('Incline Dumbbell Bicep Curl', 3, '10-12'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 3, '8-10'),
                ]
              },
              {
                id: 'pplul-legs', name: 'Legs & Core Day',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 4, '6-8'),
                  mapToWorkoutExercise('Dumbbell Romanian Deadlift', 3, '8-10'),
                  mapToWorkoutExercise('Barbell Hip Thrust', 3, '10-12'),
                  mapToWorkoutExercise('Walking Lunges', 3, '10-12'),
                  mapToWorkoutExercise('Standing Calf Raise', 4, '12-15'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 3, '15'),
                ]
              },
              {
                id: 'pplul-upper', name: 'Upper Body Hypertrophy',
                exercises: [
                  mapToWorkoutExercise('Incline Dumbbell Press', 4, '8-12'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 4, '8-12'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 3, '12-15'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 3, '10-12'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 3, '10-12'),
                ]
              },
              {
                id: 'pplul-lower', name: 'Lower Body Power',
                exercises: [
                  mapToWorkoutExercise('Barbell Deadlift', 4, '5'),
                  mapToWorkoutExercise('Barbell Back Squat', 4, '6-8'),
                  mapToWorkoutExercise('Dumbbell Romanian Deadlift', 3, '8-10'),
                  mapToWorkoutExercise('Standing Calf Raise', 4, '12-15'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 3, '15'),
                ]
              }
            ];
          } else {
            // 6 days
            splitName = 'Push Pull Legs';
            name = 'GymVerse Intermediate PPL (6-Day)';
            description = 'A classic high-frequency 6-day Push-Pull-Legs program focused on high hypertrophy volume and progressive overload. Run each workout twice per week.';
            workouts = [
              {
                id: 'ppl-push', name: 'Push Day (Chest, Shoulders & Triceps)',
                exercises: [
                  mapToWorkoutExercise('Barbell Bench Press', 4, '6-8'),
                  mapToWorkoutExercise('Incline Dumbbell Press', 3, '8-12'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '8-10'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 4, '12-15'),
                  mapToWorkoutExercise('Standing Cable Fly', 3, '12-15'),
                  mapToWorkoutExercise('EZ-Bar Skull Crusher', 3, '10-12'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 3, '12-15'),
                ]
              },
              {
                id: 'ppl-pull', name: 'Pull Day (Back, Rear Delts & Biceps)',
                exercises: [
                  mapToWorkoutExercise('Bent-Over Barbell Row', 4, '6-8'),
                  mapToWorkoutExercise('Pull-Up', 4, 'Max'),
                  mapToWorkoutExercise('Seated Cable Row', 3, '10-12'),
                  mapToWorkoutExercise('Face Pulls', 3, '12-15'),
                  mapToWorkoutExercise('Incline Dumbbell Bicep Curl', 3, '10-12'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 3, '8-10'),
                  mapToWorkoutExercise('Barbell Wrist Curl', 2, '15'),
                ]
              },
              {
                id: 'ppl-legs', name: 'Legs & Core Day',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 4, '6-8'),
                  mapToWorkoutExercise('Dumbbell Romanian Deadlift', 3, '8-10'),
                  mapToWorkoutExercise('Barbell Hip Thrust', 3, '10-12'),
                  mapToWorkoutExercise('Walking Lunges', 3, '10-12'),
                  mapToWorkoutExercise('Standing Calf Raise', 4, '12-15'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 3, '15'),
                ]
              }
            ];
          }

        // --- ADVANCED ---
        } else {
          if (freq <= 4) {
            splitName = 'Powerbuilding';
            name = 'GymVerse Elite Powerbuilding';
            description = 'An advanced periodized structure implementing strength peaking, deload phases, and high-intensity RPE targets.';
            workouts = [
              {
                id: 'elite-peak', name: 'Heavy Peaking Day (RPE 9-10)',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 5, '3-5 (RPE 9)'),
                  mapToWorkoutExercise('Barbell Bench Press', 5, '3-5 (RPE 9)'),
                  mapToWorkoutExercise('Barbell Deadlift', 4, '2-4 (RPE 9)'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '5 (RPE 8.5)'),
                  mapToWorkoutExercise('Barbell Hip Thrust', 3, '6 (RPE 9)'),
                ]
              },
              {
                id: 'elite-hyper', name: 'Accessory Hypertrophy (Volume)',
                exercises: [
                  mapToWorkoutExercise('Incline Dumbbell Press', 4, '10-12'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 4, '10-12'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 4, '15'),
                  mapToWorkoutExercise('Incline Dumbbell Bicep Curl', 3, '12'),
                  mapToWorkoutExercise('EZ-Bar Skull Crusher', 3, '12'),
                ]
              }
            ];
          } else {
            // 5 or 6 days
            splitName = 'PPL + Upper Lower';
            name = 'GymVerse Elite 5/6-Day Split';
            description = 'An advanced 5-day rotation combining strength peaking with hypertrophy specialization for maximum stimulus-to-fatigue ratio.';
            workouts = [
              {
                id: 'adv-heavy', name: 'Heavy Compound Day',
                exercises: [
                  mapToWorkoutExercise('Barbell Back Squat', 5, '3 (RPE 9)'),
                  mapToWorkoutExercise('Barbell Bench Press', 5, '3 (RPE 9)'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 4, '5 (RPE 8)'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '5 (RPE 8.5)'),
                ]
              },
              {
                id: 'adv-hyper-up', name: 'Upper Body Hypertrophy',
                exercises: [
                  mapToWorkoutExercise('Incline Dumbbell Press', 4, '10-12'),
                  mapToWorkoutExercise('Seated Cable Row', 4, '10-12'),
                  mapToWorkoutExercise('Dumbbell Lateral Raise', 4, '12-15'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 3, '12-15'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 3, '10-12'),
                ]
              },
              {
                id: 'adv-legs', name: 'Legs & Posterior Chain',
                exercises: [
                  mapToWorkoutExercise('Barbell Deadlift', 4, '3-5 (RPE 9)'),
                  mapToWorkoutExercise('Barbell Back Squat', 4, '6-8'),
                  mapToWorkoutExercise('Dumbbell Romanian Deadlift', 3, '8-10'),
                  mapToWorkoutExercise('Walking Lunges', 3, '10-12'),
                  mapToWorkoutExercise('Standing Calf Raise', 4, '12-15'),
                  mapToWorkoutExercise('Kneeling Cable Crunch', 3, '15'),
                ]
              },
              {
                id: 'adv-push', name: 'Push Specialization',
                exercises: [
                  mapToWorkoutExercise('Barbell Bench Press', 4, '6-8'),
                  mapToWorkoutExercise('Incline Dumbbell Press', 3, '8-12'),
                  mapToWorkoutExercise('Barbell Overhead Press', 3, '8-10'),
                  mapToWorkoutExercise('Standing Cable Fly', 3, '12-15'),
                  mapToWorkoutExercise('EZ-Bar Skull Crusher', 3, '10-12'),
                  mapToWorkoutExercise('Cable Tricep Pushdown', 3, '12-15'),
                ]
              },
              {
                id: 'adv-pull', name: 'Pull Specialization',
                exercises: [
                  mapToWorkoutExercise('Pull-Up', 4, 'Max'),
                  mapToWorkoutExercise('Bent-Over Barbell Row', 4, '8-10'),
                  mapToWorkoutExercise('Face Pulls', 3, '12-15'),
                  mapToWorkoutExercise('Incline Dumbbell Bicep Curl', 3, '10-12'),
                  mapToWorkoutExercise('Barbell Bicep Curl', 3, '8-10'),
                  mapToWorkoutExercise('Barbell Wrist Curl', 2, '15'),
                ]
              }
            ];
          }
        }

        // Ensure workouts array matches the requested frequency
        if (workouts.length > freq) {
          workouts = workouts.slice(0, freq);
        } else if (workouts.length < freq) {
          const original = [...workouts];
          while (workouts.length < freq) {
            const src = original[workouts.length % original.length];
            workouts.push({
              ...src,
              id: `${src.id}-alt-${workouts.length}`,
              name: `${src.name} (Day ${workouts.length + 1})`,
              exercises: src.exercises.map(ex => ({ ...ex, sets: ex.sets.map(s => ({ ...s })) })),
            });
          }
        }

        // Adjust for Dumbbell only / Bodyweight only environment
        if (env === 'Dumbbells Only') {
          const dbNameMap: Record<string, string> = {
            'Barbell Back Squat': 'Dumbbell Bulgarian Split Squat',
            'Barbell Bench Press': 'Incline Dumbbell Press',
            'Barbell Deadlift': 'Dumbbell Romanian Deadlift',
            'Barbell Overhead Press': 'Seated Dumbbell Press',
            'Barbell Bicep Curl': 'Dumbbell Bicep Curl',
            'Bent-Over Barbell Row': 'Single-Arm Dumbbell Row',
            'Barbell Hip Thrust': 'Dumbbell Romanian Deadlift',
            'Barbell Wrist Curl': 'Hammer Wrist Curl',
            'Cable Tricep Pushdown': 'Tricep Overhead Extension (Dumbbell)',
            'EZ-Bar Skull Crusher': 'Dumbbell Skull Crusher',
            'Pull-Up': 'Bent-Over Barbell Row',
            'Standing Cable Fly': 'Standing Cable Fly',
            'Standing Calf Raise': 'Dumbbell Calf Raise',
            'Kneeling Cable Crunch': 'Decline Sit-up',
            'Walking Lunges': 'Dumbbell Lunges',
            'Seated Cable Row': 'Single-Arm Dumbbell Row',
            'Face Pulls': 'Dumbbell Lateral Raise',
            'Goblet Squat': 'Goblet Squat',
            'Dumbbell Bench Press': 'Dumbbell Bench Press',
            'Dumbbell Row': 'Single-Arm Dumbbell Row',
          };
          workouts.forEach(wo => {
            wo.exercises = wo.exercises.map(ex => {
              const replacement = dbNameMap[ex.name];
              return replacement ? mapToWorkoutExercise(replacement, ex.targetSets, ex.targetReps) : ex;
            });
          });
        } else if (env === 'Home Gym') {
          const hgNameMap: Record<string, string> = {
            'Barbell Back Squat': 'Dumbbell Bulgarian Split Squat',
            'Barbell Bench Press': 'Dumbbell Bench Press',
            'Barbell Deadlift': 'Dumbbell Romanian Deadlift',
            'Barbell Overhead Press': 'Seated Dumbbell Press',
            'Barbell Bicep Curl': 'Dumbbell Bicep Curl',
            'Bent-Over Barbell Row': 'Single-Arm Dumbbell Row',
            'Barbell Hip Thrust': 'Dumbbell Romanian Deadlift',
            'Barbell Wrist Curl': 'Hammer Wrist Curl',
            'Cable Tricep Pushdown': 'Tricep Overhead Extension (Dumbbell)',
            'EZ-Bar Skull Crusher': 'Dumbbell Skull Crusher',
            'Pull-Up': 'Pull-Up',
            'Standing Cable Fly': 'Dumbbell Bench Press',
            'Standing Calf Raise': 'Standing Calf Raise',
            'Kneeling Cable Crunch': 'Decline Sit-up',
            'Walking Lunges': 'Dumbbell Lunges',
            'Seated Cable Row': 'Single-Arm Dumbbell Row',
            'Face Pulls': 'Dumbbell Lateral Raise',
            'Goblet Squat': 'Goblet Squat',
            'Dumbbell Bench Press': 'Dumbbell Bench Press',
            'Dumbbell Row': 'Single-Arm Dumbbell Row',
            'Incline Dumbbell Press': 'Incline Dumbbell Press',
            'Barbell Row': 'Single-Arm Dumbbell Row',
          };
          workouts.forEach(wo => {
            wo.exercises = wo.exercises.map(ex => {
              const replacement = hgNameMap[ex.name];
              return replacement ? mapToWorkoutExercise(replacement, ex.targetSets, ex.targetReps) : ex;
            });
          });
        } else if (env === 'Bodyweight Only') {
          const bwNameMap: Record<string, string> = {
            'Barbell Back Squat': 'Pistol Squat',
            'Barbell Bench Press': 'Push-Up',
            'Barbell Deadlift': 'Glute Bridge',
            'Barbell Overhead Press': 'Pike Push-ups',
            'Barbell Bicep Curl': 'Pull-Up',
            'Bent-Over Barbell Row': 'Pull-Up',
            'Barbell Hip Thrust': 'Glute Bridge',
            'Barbell Wrist Curl': 'Dead Hangs',
            'Cable Tricep Pushdown': 'Diamond Push-ups',
            'EZ-Bar Skull Crusher': 'Diamond Push-ups',
            'Pull-Up': 'Pull-Up',
            'Standing Cable Fly': 'Push-Up',
            'Standing Calf Raise': 'Bodyweight Calf Raise',
            'Kneeling Cable Crunch': 'Decline Sit-up',
            'Walking Lunges': 'Walking Lunges',
            'Seated Cable Row': 'Pull-Up',
            'Face Pulls': 'Pull-Up',
            'Goblet Squat': 'Pistol Squat',
            'Dumbbell Bench Press': 'Push-Up',
            'Dumbbell Row': 'Pull-Up',
            'Dumbbell Romanian Deadlift': 'Glute Bridge',
            'Dumbbell Lateral Raise': 'Pike Push-ups',
            'Incline Dumbbell Press': 'Decline Push-up',
            'Incline Dumbbell Bicep Curl': 'Chin-up',
            'Seated Dumbbell Press': 'Pike Push-ups',
            'Single-Arm Dumbbell Row': 'Pull-Up',
            'Dumbbell Hip Thrust': 'Glute Bridge',
            'Dumbbell Calf Raise': 'Bodyweight Calf Raise',
            'Weighted Crunch': 'Decline Sit-up',
            'Dumbbell Lunges': 'Walking Lunges',
            'Tricep Overhead Extension (Dumbbell)': 'Diamond Push-ups',
            'Dumbbell Skull Crusher': 'Diamond Push-ups',
            'Dumbbell Bulgarian Split Squat': 'Pistol Squat',
            'Dumbbell Wrist Curl': 'Dead Hangs',
          };
          workouts.forEach(wo => {
            wo.exercises = wo.exercises.map(ex => {
              const replacement = bwNameMap[ex.name] || 'Push-Up';
              return mapToWorkoutExercise(replacement, ex.targetSets, ex.targetReps);
            });
          });
        }

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
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          if (state.activeProgram && state.activeProgram.workouts.length !== state.profile.frequency) {
            state.generateProgram();
          }
        }
      },
    }
  )
);
