"use client";

import React, { useState } from 'react';
import { useGymStore } from '@/store/useGymStore';
import { Onboarding } from '@/components/Onboarding';
import { ActiveWorkoutTracker } from '@/components/ActiveWorkoutTracker';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { AICoach } from '@/components/AICoach';
import { ProgressCharts } from '@/components/ProgressCharts';
import { ProfileEditor } from '@/components/ProfileEditor';
import { LoginScreen } from '@/components/LoginScreen';
import { ExerciseVisual } from '@/components/ExerciseVisual';
import { Card } from '@/components/Card';
import {
  Dumbbell, BookOpen, Bot, BarChart3, Menu,
  Play, Clock, Zap, Award, User, LogOut, Trash2, Shield
} from 'lucide-react';

type Tab = 'workout' | 'library' | 'coach' | 'progress' | 'profile';

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'workout', label: 'Workout', icon: <Dumbbell size={20} /> },
  { id: 'library', label: 'Library', icon: <BookOpen size={20} /> },
  { id: 'coach', label: 'AI Coach', icon: <Bot size={20} /> },
  { id: 'progress', label: 'Progress', icon: <BarChart3 size={20} /> },
  { id: 'profile', label: 'Profile', icon: <User size={20} /> },
];

function WorkoutDashboard() {
  const { activeProgram, startWorkout, workoutLogs, profile, deleteWorkoutLog } = useGymStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const lastWorkout = workoutLogs[0];

  const handleDelete = (id: string) => {
    deleteWorkoutLog(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Program Overview */}
      {activeProgram && (
        <Card className="border-emerald-500/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-emerald-400" size={22} />
                {activeProgram.name}
              </h2>
              <p className="text-zinc-400 text-sm mt-1 max-w-lg">{activeProgram.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-semibold">
                  {activeProgram.level}
                </span>
                <span className="text-[11px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-semibold">
                  {activeProgram.splitName}
                </span>
                <span className="text-[11px] bg-zinc-800/80 text-zinc-400 px-2.5 py-1 rounded-full">
                  {profile.frequency}x/week · {profile.environment}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Program */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-zinc-200">Your Weekly Program</h3>
          {activeProgram && (
            <span className="text-xs text-zinc-500">{activeProgram.workouts.length} {activeProgram.workouts.length === 1 ? 'workout' : 'workouts'}</span>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeProgram ? (
            activeProgram.workouts.map((wo, i) => {
              const dayOffset = (new Date().getDay() + 6) % 7;
              const todayIdx = dayOffset < activeProgram.workouts.length ? dayOffset : -1;
              const isToday = i === todayIdx;
              return (
                <Card key={wo.id} hoverable className={isToday ? 'ring-1 ring-emerald-500/30' : ''}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded-md">
                        Day {i + 1}
                      </span>
                      {isToday && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          Today
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => startWorkout(wo)}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg text-sm transition-all shrink-0 ml-3 cursor-pointer"
                    >
                      <Play size={14} /> Start
                    </button>
                  </div>

                  <h4 className="text-white font-bold text-base">{wo.name}</h4>
                  <p className="text-zinc-500 text-xs mt-0.5 mb-3">{wo.exercises.length} exercises</p>

                  <div className="space-y-1">
                    {wo.exercises.map((ex, idx) => (
                      <div key={ex.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 w-5 h-5 rounded flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <ExerciseVisual
                          name={ex.name}
                          category={ex.category}
                          youtubeId={ex.youtubeId}
                          size="sm"
                        />
                        <span className="text-xs text-zinc-300 font-medium truncate">{ex.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })
          ) : (
            <Card>
              <p className="text-zinc-400">No program generated yet. Complete the onboarding to get started.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {workoutLogs.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center !p-4">
            <p className="text-2xl font-bold text-emerald-400">{workoutLogs.length}</p>
            <p className="text-zinc-400 text-xs mt-1">Workouts</p>
          </Card>
          <Card className="text-center !p-4">
            <p className="text-2xl font-bold text-blue-400">
              {lastWorkout ? `${Math.round(lastWorkout.totalVolume / 100) * 100}` : '0'}
            </p>
            <p className="text-zinc-400 text-xs mt-1">Volume (kg)</p>
          </Card>
          <Card className="text-center !p-4">
            <p className="text-2xl font-bold text-amber-400">
              {lastWorkout ? `${lastWorkout.durationMinutes}m` : '0m'}
            </p>
            <p className="text-zinc-400 text-xs mt-1">Duration</p>
          </Card>
        </div>
      )}

      {/* Recent Workouts */}
      {workoutLogs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-3">Recent Workouts</h3>
          <div className="space-y-2">
            {workoutLogs.slice(0, 5).map((log) => (
              <Card key={log.id} className="!p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{log.name}</p>
                      <p className="text-zinc-500 text-xs">
                        {new Date(log.date).toLocaleDateString()} · {log.durationMinutes} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <p className="text-emerald-400 text-sm font-semibold">{log.totalVolume.toLocaleString()} kg</p>
                      <p className="text-zinc-500 text-xs">{log.exercises.length} exercises</p>
                    </div>
                    <button
                      onClick={() => setConfirmDelete(log.id)}
                      className="p-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-500 hover:text-rose-400 transition-all cursor-pointer"
                      title="Delete workout"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-white font-bold text-lg">Delete Workout?</h3>
            <p className="text-zinc-400 text-sm">This will permanently remove this workout from your logs. This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-400 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { profile, activeWorkout, hasHydrated, isLoggedIn, loggedInUser, logout } = useGymStore();
  const [activeTab, setActiveTab] = useState<Tab>('workout');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading GymVerse...</p>
        </div>
      </div>
    );
  }

  // Login gate
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // Onboarding flow
  if (!profile.isOnboarded) {
    return <Onboarding />;
  }

  // Active workout takes full screen
  if (activeWorkout) {
    return <ActiveWorkoutTracker />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-30 h-full md:min-h-screen w-64
          bg-zinc-900/80 backdrop-blur-xl border-r border-white/5
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Dumbbell size={16} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">GymVerse AI</h1>
              <p className="text-zinc-500 text-xs">{profile.experienceLevel}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border
                ${activeTab === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-transparent'
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 text-zinc-500 text-xs">
            <Award size={14} className="text-amber-500" />
            <span>GymVerse v0.1</span>
          </div>
          <a
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-600 hover:text-emerald-400 hover:bg-white/5 transition-all"
          >
            <Shield size={14} /> Admin Panel
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-zinc-400 hover:text-white p-1"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-white font-semibold">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>

            {/* User avatar & logout */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-bold">
                  {loggedInUser?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <span className="text-zinc-300 text-sm font-medium hidden sm:block">{loggedInUser?.name}</span>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 py-1 overflow-hidden">
                    <button
                      onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <User size={14} /> Profile
                    </button>
                    <hr className="border-zinc-800" />
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-rose-400 hover:bg-zinc-800 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 max-w-5xl w-full mx-auto">
          {activeTab === 'workout' && <WorkoutDashboard />}
          {activeTab === 'library' && <ExerciseLibrary />}
          {activeTab === 'coach' && <AICoach />}
          {activeTab === 'progress' && <ProgressCharts />}
          {activeTab === 'profile' && <ProfileEditor />}
        </div>
      </main>
    </div>
  );
}
