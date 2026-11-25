import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Check,
  Flame,
  Play,
  SlidersHorizontal,
  Trophy,
} from 'lucide-react';
import {
  AppView,
  DifficultyLevel,
  FitnessGoal,
  MemberProfile,
  PaymentTransaction,
  WorkoutLocation,
  WorkoutProgram,
  WorkoutSessionRecord,
} from '../types/fitpro';
import { ImageWithFallback } from './ImageWithFallback';

interface MemberDashboardProps {
  profile: MemberProfile;
  programs: WorkoutProgram[];
  sessions: WorkoutSessionRecord[];
  payments: PaymentTransaction[];
  savedIds: string[];
  onStartWorkout: (program: WorkoutProgram) => void;
  onOpenOnboarding: () => void;
  onUpdateProfile: (updated: Partial<MemberProfile>) => void;
  onCancelMembership: () => void;
  onNavigate: (view: AppView) => void;
}

const WEEK_DAYS: WorkoutSessionRecord['dayOfWeek'][] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  profile,
  programs,
  sessions,
  payments,
  savedIds,
  onStartWorkout,
  onOpenOnboarding,
  onUpdateProfile,
  onCancelMembership,
  onNavigate,
}) => {
  const [section, setSection] = useState<'overview' | 'settings'>('overview');
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const [editName, setEditName] = useState(profile.fullName);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editGoal, setEditGoal] = useState<FitnessGoal>(profile.goal);
  const [editLevel, setEditLevel] = useState<DifficultyLevel>(profile.experienceLevel);
  const [editLocation, setEditLocation] = useState<WorkoutLocation>(profile.workoutLocation);
  const [editDays, setEditDays] = useState(profile.workoutsPerWeek);
  const [savedFlag, setSavedFlag] = useState(false);

  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    [sessions]
  );

  const weeklyMinutesByDay = useMemo(() => {
    const map: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
    sessions.forEach((s) => {
      map[s.dayOfWeek] = (map[s.dayOfWeek] || 0) + s.durationMinutes;
    });
    return map;
  }, [sessions]);

  const maxDayMinutes = Math.max(60, ...Object.values(weeklyMinutesByDay));

  const recommendedPrograms = useMemo(() => {
    return programs
      .filter((p) => p.isPublished)
      .filter((p) => {
        if (profile.workoutLocation === 'Home') return p.category === 'home' || p.category === 'mobility';
        return true;
      })
      .slice(0, 3);
  }, [programs, profile.workoutLocation]);

  const todaysWorkout = recommendedPrograms[0] || programs[0];
  const savedPrograms = programs.filter((p) => savedIds.includes(p.id));
  const goalCompletionPct = Math.min(
    100,
    Math.round((sessions.length / Math.max(1, profile.workoutsPerWeek)) * 100)
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName: editName.trim() || profile.fullName,
      email: editEmail.trim() || profile.email,
      goal: editGoal,
      experienceLevel: editLevel,
      workoutLocation: editLocation,
      workoutsPerWeek: editDays,
    });
    setSavedFlag(true);
    window.setTimeout(() => setSavedFlag(false), 2500);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#232A26]">
        <div>
          <p className="text-xs text-[#A1AAA3]">
            Member Application ·{' '}
            <span className={profile.membershipTier === 'premium' ? 'text-[#B8F34A] font-medium' : 'text-[#F7F9F6]'}>
              {profile.planName}
            </span>
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#F7F9F6]">
            Welcome back, {profile.fullName}
          </h1>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Goal: <span className="text-[#F7F9F6] font-medium">{profile.goal}</span> ·{' '}
            {profile.experienceLevel} · {profile.workoutLocation} ({profile.workoutsPerWeek} days/week)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center p-1 rounded-[10px] border border-[#232A26] bg-[#151917]">
            <button
              type="button"
              onClick={() => setSection('overview')}
              className={`px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                section === 'overview' ? 'bg-[#B8F34A] text-[#0B0D0C]' : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setSection('settings')}
              className={`px-3.5 py-1.5 rounded-[7px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                section === 'settings' ? 'bg-[#B8F34A] text-[#0B0D0C]' : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
              }`}
            >
              Profile &amp; Billing
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenOnboarding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-[#232A26] bg-[#151917] text-xs font-semibold text-[#F7F9F6] hover:border-[#B8F34A] cursor-pointer whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8F34A]" />
            Calibrate Goals
          </button>
        </div>
      </div>

      {section === 'overview' ? (
        <>
          {/* KPI Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-[14px] border border-[#232A26] bg-[#151917] p-5">
              <div className="flex items-center justify-between text-xs text-[#A1AAA3]">
                <span>Completed Sessions</span>
                <Trophy className="w-4 h-4 text-[#B8F34A]" />
              </div>
              <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#F7F9F6]">
                {sessions.length}
              </p>
              <p className="mt-1 text-xs text-[#A1AAA3]">Recorded across your training log</p>
            </div>

            <div className="rounded-[14px] border border-[#232A26] bg-[#151917] p-5">
              <div className="flex items-center justify-between text-xs text-[#A1AAA3]">
                <span>Active Minutes</span>
                <Calendar className="w-4 h-4 text-[#B8F34A]" />
              </div>
              <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#F7F9F6]">
                {totalMinutes}
              </p>
              <p className="mt-1 text-xs text-[#A1AAA3]">Total minutes completed</p>
            </div>

            <div className="rounded-[14px] border border-[#232A26] bg-[#151917] p-5">
              <div className="flex items-center justify-between text-xs text-[#A1AAA3]">
                <span>Weekly Target</span>
                <Flame className="w-4 h-4 text-[#B8F34A]" />
              </div>
              <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#B8F34A]">
                {goalCompletionPct}%
              </p>
              <p className="mt-1 text-xs text-[#A1AAA3]">
                Target: {profile.workoutsPerWeek} sessions / week
              </p>
            </div>

            <div className="rounded-[14px] border border-[#232A26] bg-[#151917] p-5">
              <div className="flex items-center justify-between text-xs text-[#A1AAA3]">
                <span>Saved Workouts</span>
                <Bookmark className="w-4 h-4 text-[#B8F34A]" />
              </div>
              <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#F7F9F6]">
                {savedPrograms.length}
              </p>
              <p className="mt-1 text-xs text-[#A1AAA3]">
                {profile.membershipTier === 'free' ? 'Free limit: 3 saved' : 'Unlimited saved'}
              </p>
            </div>
          </div>

          {/* Today's Workout + Weekly Activity Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {todaysWorkout && (
              <div className="lg:col-span-6 rounded-[16px] border border-[#232A26] bg-[#151917] overflow-hidden flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-12 flex-1">
                  <div className="sm:col-span-5 min-h-[200px]">
                    <ImageWithFallback
                      src={todaysWorkout.thumbnailUrl}
                      alt={todaysWorkout.title}
                      className="w-full h-full object-cover"
                      fallbackTitle={todaysWorkout.title}
                    />
                  </div>
                  <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-medium text-[#B8F34A]">Today&apos;s Recommended Session</p>
                      <h2 className="mt-1.5 font-display text-2xl font-bold text-[#F7F9F6]">
                        {todaysWorkout.title}
                      </h2>
                      <p className="mt-1 text-xs text-[#A1AAA3]">
                        {todaysWorkout.categoryLabel} · {todaysWorkout.difficulty} ·{' '}
                        <span className="tabular-nums">{todaysWorkout.durationMinutes} min</span> ·{' '}
                        {todaysWorkout.exercises.length} exercises
                      </p>
                      <p className="mt-3 text-sm text-[#A1AAA3] leading-relaxed line-clamp-3">
                        {todaysWorkout.description}
                      </p>
                    </div>

                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => onStartWorkout(todaysWorkout)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] cursor-pointer"
                      >
                        <Play className="w-4 h-4" />
                        Start Workout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Activity Bar Chart with Reference Lines */}
            <div className="lg:col-span-6 rounded-[16px] border border-[#232A26] bg-[#151917] p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#F7F9F6]">Weekly Activity</h2>
                  <p className="text-xs text-[#A1AAA3]">
                    {hoveredDay
                      ? `${hoveredDay}: ${weeklyMinutesByDay[hoveredDay] || 0} active minutes`
                      : 'Training minutes logged per day'}
                  </p>
                </div>
                <span className="font-mono-tabular text-xs text-[#B8F34A]">
                  {totalMinutes} min total
                </span>
              </div>

              <div className="relative mt-6 h-48 flex flex-col justify-end">
                {/* Horizontal Reference Lines */}
                <div className="absolute inset-0 bottom-7 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-dashed border-[#232A26] flex justify-end">
                    <span className="font-mono-tabular text-[10px] text-[#A1AAA3]/70 -mt-3.5">
                      {maxDayMinutes}m
                    </span>
                  </div>
                  <div className="border-b border-dashed border-[#232A26] flex justify-end">
                    <span className="font-mono-tabular text-[10px] text-[#A1AAA3]/70 -mt-3.5">
                      {Math.round(maxDayMinutes / 2)}m
                    </span>
                  </div>
                  <div className="border-b border-[#232A26]" />
                </div>

                <div className="relative z-10 h-44 grid grid-cols-7 gap-3 items-end">
                  {WEEK_DAYS.map((day) => {
                    const mins = weeklyMinutesByDay[day] || 0;
                    const heightPct = mins > 0 ? Math.max(14, Math.round((mins / maxDayMinutes) * 100)) : 5;
                    const isHovered = hoveredDay === day;
                    return (
                      <div
                        key={day}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="h-full flex flex-col items-center justify-end gap-2 cursor-default"
                      >
                        <span className="font-mono-tabular text-[11px] text-[#A1AAA3]">
                          {mins > 0 ? `${mins}m` : '—'}
                        </span>
                        <div className="w-full flex-1 flex items-end px-1">
                          <div
                            className={`w-full rounded-t-[6px] transition-colors duration-150 ${
                              mins > 0
                                ? isHovered
                                  ? 'bg-[#d0f97a]'
                                  : 'bg-[#B8F34A]'
                                : 'bg-[#232A26]'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isHovered ? 'text-[#F7F9F6]' : 'text-[#A1AAA3]'
                          }`}
                        >
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Session History Table & Saved Programs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-[16px] border border-[#232A26] bg-[#151917] p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-display text-2xl font-bold text-[#F7F9F6]">Recent Session History</h2>
                <button
                  type="button"
                  onClick={() => onNavigate('workouts')}
                  className="text-xs font-semibold text-[#B8F34A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Browse Workouts
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {sessions.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-[#232A26] rounded-[12px]">
                  <p className="text-sm font-medium text-[#F7F9F6]">No workouts logged yet</p>
                  <p className="mt-1 text-xs text-[#A1AAA3]">Start Today&apos;s Workout to log your first session.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#232A26] text-xs text-[#A1AAA3]">
                        <th className="py-2.5 pr-4 font-medium">Program</th>
                        <th className="py-2.5 px-3 font-medium">Category</th>
                        <th className="py-2.5 px-3 font-medium text-right">Exercises</th>
                        <th className="py-2.5 pl-3 font-medium text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232A26]/70 text-sm">
                      {sessions.slice(0, 6).map((s) => (
                        <tr key={s.id} className="hover:bg-[#1D231F]/60 transition-colors">
                          <td className="py-3 pr-4 font-medium text-[#F7F9F6]">{s.programTitle}</td>
                          <td className="py-3 px-3 text-xs text-[#A1AAA3]">{s.categoryLabel}</td>
                          <td className="py-3 px-3 text-right font-mono-tabular text-xs text-[#A1AAA3]">
                            {s.exercisesCompleted}/{s.totalExercises}
                          </td>
                          <td className="py-3 pl-3 text-right font-mono-tabular text-xs text-[#B8F34A]">
                            {s.durationMinutes} min
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 rounded-[16px] border border-[#232A26] bg-[#151917] p-6">
              <h2 className="font-display text-2xl font-bold text-[#F7F9F6] mb-4">Saved Programs</h2>
              {savedPrograms.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-[#232A26] rounded-[12px]">
                  <p className="text-sm font-medium text-[#F7F9F6]">No saved programs</p>
                  <p className="mt-1 text-xs text-[#A1AAA3]">Bookmark programs in the Workout Library for quick access.</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('workouts')}
                    className="mt-4 px-4 py-2 rounded-[10px] border border-[#232A26] text-xs font-semibold text-[#F7F9F6] hover:border-[#B8F34A] cursor-pointer"
                  >
                    Explore Library
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPrograms.map((prog) => (
                    <div
                      key={prog.id}
                      className="p-3.5 rounded-[12px] border border-[#232A26] bg-[#0B0D0C] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#F7F9F6] truncate">{prog.title}</p>
                        <p className="text-xs text-[#A1AAA3]">
                          {prog.categoryLabel} · <span className="tabular-nums">{prog.durationMinutes} min</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onStartWorkout(prog)}
                        className="px-3 py-1.5 rounded-[8px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold hover:bg-[#c8f76c] cursor-pointer shrink-0"
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Profile, Goals & Billing Settings Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSaveSettings}
            className="lg:col-span-7 rounded-[16px] border border-[#232A26] bg-[#151917] p-6 space-y-5"
          >
            <div>
              <h2 className="font-display text-2xl font-bold text-[#F7F9F6]">
                Account &amp; Training Preferences
              </h2>
              <p className="text-xs text-[#A1AAA3] mt-0.5">
                Update your personal profile, primary goal, and weekly training cadence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prof-name" className="block text-xs text-[#A1AAA3] mb-1.5">
                  Full Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-[10px] border border-[#232A26] bg-[#0B0D0C] text-sm text-[#F7F9F6] focus:border-[#B8F34A] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="prof-email" className="block text-xs text-[#A1AAA3] mb-1.5">
                  Email Address
                </label>
                <input
                  id="prof-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-[10px] border border-[#232A26] bg-[#0B0D0C] text-sm text-[#F7F9F6] focus:border-[#B8F34A] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="prof-goal" className="block text-xs text-[#A1AAA3] mb-1.5">
                  Primary Fitness Goal
                </label>
                <select
                  id="prof-goal"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value as FitnessGoal)}
                  className="w-full h-11 px-3 rounded-[10px] border border-[#232A26] bg-[#0B0D0C] text-sm text-[#F7F9F6]"
                >
                  <option value="Build muscle">Build muscle</option>
                  <option value="Lose weight">Lose weight</option>
                  <option value="Improve strength">Improve strength</option>
                  <option value="Improve endurance">Improve endurance</option>
                  <option value="Improve flexibility">Improve flexibility</option>
                  <option value="General fitness">General fitness</option>
                </select>
              </div>
              <div>
                <label htmlFor="prof-level" className="block text-xs text-[#A1AAA3] mb-1.5">
                  Experience Level
                </label>
                <select
                  id="prof-level"
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value as DifficultyLevel)}
                  className="w-full h-11 px-3 rounded-[10px] border border-[#232A26] bg-[#0B0D0C] text-sm text-[#F7F9F6]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label htmlFor="prof-loc" className="block text-xs text-[#A1AAA3] mb-1.5">
                  Training Location
                </label>
                <select
                  id="prof-loc"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value as WorkoutLocation)}
                  className="w-full h-11 px-3 rounded-[10px] border border-[#232A26] bg-[#0B0D0C] text-sm text-[#F7F9F6]"
                >
                  <option value="Gym">Gym</option>
                  <option value="Home">Home</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="prof-days" className="block text-xs text-[#A1AAA3] mb-1.5">
                  Workouts Per Week
                </label>
                <input
                  id="prof-days"
                  type="number"
                  min={1}
                  max={7}
                  value={editDays}
                  onChange={(e) => setEditDays(Number(e.target.value) || 3)}
                  className="w-full h-11 px-3.5 rounded-[10px] border border-[#232A26] bg-[#0B0D0C] text-sm font-mono-tabular text-[#F7F9F6]"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#232A26]">
              {savedFlag ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#48C774]">
                  <Check className="w-4 h-4" />
                  Profile preferences saved
                </span>
              ) : (
                <span className="text-xs text-[#A1AAA3]">Changes update recommendations immediately.</span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold hover:bg-[#c8f76c] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[16px] border border-[#232A26] bg-[#151917] p-6">
              <h2 className="font-display text-2xl font-bold text-[#F7F9F6]">Membership Status</h2>
              <div className="mt-4 p-4 rounded-[12px] border border-[#232A26] bg-[#0B0D0C] flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#F7F9F6]">{profile.planName}</p>
                  <p className="text-xs text-[#A1AAA3] mt-0.5">
                    {profile.renewalDate ? `Renews ${profile.renewalDate}` : 'No recurring charge'}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    profile.membershipTier === 'premium' ? 'text-[#B8F34A]' : 'text-[#A1AAA3]'
                  }`}
                >
                  {profile.membershipTier === 'premium' ? 'Active Premium' : 'Free Tier'}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="px-4 py-2 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold hover:bg-[#c8f76c] cursor-pointer"
                >
                  {profile.membershipTier === 'premium' ? 'Change Plan' : 'Upgrade to Premium'}
                </button>
                {profile.membershipTier === 'premium' && (
                  <button
                    type="button"
                    onClick={onCancelMembership}
                    className="px-4 py-2 rounded-[10px] border border-[#232A26] text-xs font-medium text-[#A1AAA3] hover:text-[#F05C5C] hover:border-[#F05C5C]/50 cursor-pointer"
                  >
                    Downgrade to Free
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-[16px] border border-[#232A26] bg-[#151917] p-6">
              <h2 className="font-display text-xl font-bold text-[#F7F9F6] mb-3">Your Payments</h2>
              <div className="space-y-2.5 text-xs">
                {payments.slice(0, 3).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-[10px] border border-[#232A26] bg-[#0B0D0C] flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-[#F7F9F6]">{tx.planName}</p>
                      <p className="font-mono-tabular text-[11px] text-[#A1AAA3]">{tx.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-tabular font-semibold text-[#F7F9F6]">
                        ₦{tx.amountNgn.toLocaleString('en-NG')}
                      </p>
                      <p className={tx.status === 'success' ? 'text-[#48C774]' : 'text-[#A1AAA3]'}>
                        {tx.status === 'success' ? 'Verified' : tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
