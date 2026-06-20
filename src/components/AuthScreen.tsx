import React, { useState } from 'react';
import { useGymStore } from '@/store/useGymStore';
import { getFirebase } from '@/lib/firebase';
import { Dumbbell, Sparkles, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export const AuthScreen: React.FC = () => {
  const { login } = useGymStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSent(false);
    setLoading(true);

    const { auth } = getFirebase();
    if (!auth) {
      setError('Firebase not configured. Set up your Firebase project and add env vars.');
      setLoading(false);
      return;
    }

    try {
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, browserLocalPersistence, browserSessionPersistence, setPersistence } = await import('firebase/auth');

      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        login({ name: name.trim(), email: cred.user.email || '', uid: cred.user.uid });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        login({
          name: cred.user.displayName || name || email.split('@')[0],
          email: cred.user.email || '',
          uid: cred.user.uid,
        });
      }
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      const code = firebaseErr.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(firebaseErr.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Enter your email address first');
      return;
    }
    setError('');
    setResetSent(false);
    setLoading(true);

    const { auth } = getFirebase();
    if (!auth) {
      setError('Firebase not configured.');
      setLoading(false);
      return;
    }

    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      setError(firebaseErr.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white">GymVerse AI</h1>
          <p className="text-zinc-500 text-sm mt-1">Your AI-Powered Fitness Coach</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md p-6 shadow-2xl space-y-4">
          {resetSent && (
            <p className="text-emerald-400 text-xs text-center bg-emerald-500/10 rounded-lg py-2 px-3">
              Password reset email sent! Check your inbox.
            </p>
          )}

          {/* Mode Toggle */}
          <div className="flex bg-zinc-800/50 rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setResetSent(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'login' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setResetSent(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <User size={12} /> Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={12} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                className="w-full px-4 py-2.5 pr-10 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500/50"
                required
                minLength={mode === 'signup' ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer"
                  />
                  <span className="text-xs text-zinc-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg py-2 px-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
