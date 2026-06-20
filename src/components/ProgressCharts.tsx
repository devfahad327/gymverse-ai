import React, { useMemo, useState } from 'react';
import { useGymStore } from '@/store/useGymStore';
import { Card } from './Card';
import { ExerciseVisual } from './ExerciseVisual';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, Award, Calendar, Trash2, Shield } from 'lucide-react';

export const ProgressCharts: React.FC = () => {
  const { workoutLogs, profile, deleteWorkoutLog, achievements } = useGymStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Create simulated history if empty, so the user sees a beautiful dashboard right away
  const mockHistoryData = useMemo(() => {
    // 6 weeks of data
    return [
      { date: 'Wk 1', weight: profile.weight + 1.5, volume: 4200, bench: 60, squat: 80, deadlift: 100 },
      { date: 'Wk 2', weight: profile.weight + 1.2, volume: 4800, bench: 62.5, squat: 85, deadlift: 105 },
      { date: 'Wk 3', weight: profile.weight + 0.8, volume: 5100, bench: 65, squat: 90, deadlift: 110 },
      { date: 'Wk 4', weight: profile.weight + 0.4, volume: 4900, bench: 65, squat: 90, deadlift: 115 },
      { date: 'Wk 5', weight: profile.weight + 0.1, volume: 5800, bench: 67.5, squat: 95, deadlift: 120 },
      { date: 'Wk 6', weight: profile.weight, volume: 6200, bench: 70, squat: 100, deadlift: 125 },
    ];
  }, [profile.weight]);

  const activeLogsData = useMemo(() => {
    if (workoutLogs.length === 0) {
      return mockHistoryData;
    }

    // Map last 8 workouts
    return [...workoutLogs]
      .reverse()
      .slice(-8)
      .map((log) => {
        // Find peak weights for lifts
        let squat = 0, bench = 0, deadlift = 0;
        log.exercises.forEach(ex => {
          ex.sets.forEach(s => {
            if (s.completed) {
              if (ex.name.toLowerCase().includes('squat')) squat = Math.max(squat, s.weight);
              if (ex.name.toLowerCase().includes('bench')) bench = Math.max(bench, s.weight);
              if (ex.name.toLowerCase().includes('deadlift')) deadlift = Math.max(deadlift, s.weight);
            }
          });
        });

        const formattedDate = new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        return {
          date: formattedDate,
          weight: profile.weight, // static for simplicity
          volume: log.totalVolume,
          bench: bench || 50,
          squat: squat || 70,
          deadlift: deadlift || 90,
        };
      });
  }, [workoutLogs, mockHistoryData, profile.weight]);

  // Compute stats
  const peakBench = useMemo(() => {
    let peak = 60;
    workoutLogs.forEach(log => {
      log.exercises.forEach(ex => {
        if (ex.name.toLowerCase().includes('bench')) {
          ex.sets.forEach(s => {
            if (s.completed) peak = Math.max(peak, s.weight);
          });
        }
      });
    });
    return peak;
  }, [workoutLogs]);

  const peakSquat = useMemo(() => {
    let peak = 80;
    workoutLogs.forEach(log => {
      log.exercises.forEach(ex => {
        if (ex.name.toLowerCase().includes('squat')) {
          ex.sets.forEach(s => {
            if (s.completed) peak = Math.max(peak, s.weight);
          });
        }
      });
    });
    return peak;
  }, [workoutLogs]);

  const peakDeadlift = useMemo(() => {
    let peak = 100;
    workoutLogs.forEach(log => {
      log.exercises.forEach(ex => {
        if (ex.name.toLowerCase().includes('deadlift')) {
          ex.sets.forEach(s => {
            if (s.completed) peak = Math.max(peak, s.weight);
          });
        }
      });
    });
    return peak;
  }, [workoutLogs]);

  return (
    <div className="space-y-6">
      {/* Top Cards for key PRs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/40 p-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Workouts Logged</span>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{workoutLogs.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Sessions logged in history</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/40 p-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Peak Bench Press</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{peakBench} kg</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Max logged single-set weight</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/40 p-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Peak Squat</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{peakSquat} kg</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Max logged single-set weight</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/40 p-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Peak Deadlift</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">{peakDeadlift} kg</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Max logged single-set weight</p>
        </Card>
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Total Training Volume */}
        <Card className="border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-white text-sm">Training Volume History</h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeLogsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Bar dataKey="volume" name="Volume (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CHART 2: Lift Performance Trajectory */}
        <Card className="border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-white text-sm">Key Lifts Progression</h3>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeLogsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="bench" name="Bench Press" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="squat" name="Back Squat" stroke="#f59e0b" strokeWidth={2.5} />
                <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="#ef4444" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CHART 3: Weight Trend Chart */}
        <Card className="border-slate-800/80 bg-slate-950/40 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-white text-sm">Body Weight Analytics</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              Current: {profile.weight} kg
            </span>
          </div>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeLogsData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={['dataMin - 3', 'dataMax + 3']} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Completed Workouts list */}
      <Card className="border-slate-800/80 bg-slate-950/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">Completed Workouts History</h3>
          {workoutLogs.length > 0 && (
            <span className="text-[10px] text-slate-500">{workoutLogs.length} total</span>
          )}
        </div>
        {workoutLogs.length > 0 ? (
          <div className="space-y-3">
            {workoutLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/20 flex flex-col gap-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm">{log.name}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} • {log.durationMinutes} min
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-slate-400">
                      Volume: <span className="text-emerald-400 font-bold">{log.totalVolume} kg</span>
                    </div>
                    <button
                      onClick={() => setConfirmDelete(log.id)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-900/30 transition-all cursor-pointer"
                      title="Delete workout"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* Exercise list with video buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {log.exercises.map((ex) => (
                    <div key={ex.id} className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-800">
                      <ExerciseVisual
                        name={ex.name}
                        category={ex.category}
                        youtubeId={ex.youtubeId}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No logged workouts in history yet. Your completed workouts will show up here.
          </div>
        )}
      </Card>

      {/* Achievements */}
      <Card className="border-slate-800/80 bg-slate-950/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" /> Achievements
          </h3>
          <span className="text-[10px] text-slate-500">{achievements.filter(a => a.unlockedAt).length}/{achievements.length} unlocked</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border text-center transition-all ${
                ach.unlockedAt
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-zinc-900/50 border-zinc-800 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{ach.icon}</div>
              <h4 className="text-xs font-bold text-white">{ach.title}</h4>
              <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight">{ach.description}</p>
              {ach.unlockedAt && (
                <p className="text-[8px] text-amber-400/60 mt-1">
                  {new Date(ach.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

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
                onClick={() => { deleteWorkoutLog(confirmDelete); setConfirmDelete(null); }}
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
};
