import { BASE_EXERCISES, Exercise, generateExerciseLibrary } from './exercises';

const STORAGE_KEY = 'gymverse-admin-data';

export interface AdminData {
  edits: Record<string, Partial<Exercise>>;
  newExercises: Exercise[];
  pin: string;
}

function defaultData(): AdminData {
  return { edits: {}, newExercises: [], pin: 'admin' };
}

function load(): AdminData {
  if (typeof window === 'undefined') return defaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    return JSON.parse(raw) as AdminData;
  } catch {
    return defaultData();
  }
}

function save(data: AdminData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCustomExercises(): Exercise[] {
  const data = load();
  return data.newExercises;
}

export function getEditedExercises(): Record<string, Partial<Exercise>> {
  return load().edits;
}

export function getAllExercises(): Exercise[] {
  const data = load();
  const edits = data.edits;
  const library = generateExerciseLibrary();
  const base = library.map((ex) => {
    const edit = edits[ex.id];
    return edit ? { ...ex, ...edit } : ex;
  });
  return [...base, ...data.newExercises];
}

export function saveExerciseEdit(id: string, patch: Partial<Exercise>): void {
  const data = load();
  data.edits[id] = { ...(data.edits[id] || {}), ...patch };
  save(data);
}

export function addCustomExercise(exercise: Exercise): void {
  const data = load();
  data.newExercises.push(exercise);
  save(data);
}

export function updateCustomExercise(id: string, patch: Partial<Exercise>): void {
  const data = load();
  const idx = data.newExercises.findIndex((e) => e.id === id);
  if (idx !== -1) {
    data.newExercises[idx] = { ...data.newExercises[idx], ...patch };
    save(data);
  }
}

export function deleteCustomExercise(id: string): void {
  const data = load();
  data.newExercises = data.newExercises.filter((e) => e.id !== id);
  save(data);
}

export function resetEdit(id: string): void {
  const data = load();
  delete data.edits[id];
  save(data);
}

export function verifyPin(input: string): boolean {
  return load().pin === input;
}

export function changePin(newPin: string): void {
  const data = load();
  data.pin = newPin;
  save(data);
}

export function isCustomExercise(id: string): boolean {
  return getCustomExercises().some((e) => e.id === id);
}

export function isEdited(id: string): boolean {
  return id in load().edits;
}
