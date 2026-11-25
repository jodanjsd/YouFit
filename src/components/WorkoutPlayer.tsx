import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldAlert,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Exercise, WorkoutProgram, WorkoutSessionRecord } from '../types/fitpro';
import { ImageWithFallback } from './ImageWithFallback';

interface WorkoutPlayerProps {
  program: WorkoutProgram;
  exercises: Exercise[];
  onCompleteSession: (record: WorkoutSessionRecord) => void;
  onExit: () => void;
}

function formatClock(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function playSoftRestChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio context restrictions if blocked by browser policy
  }
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  program,
  exercises,
  onCompleteSession,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSetsBySeq, setCompletedSetsBySeq] = useState<Record<number, number>>({});
  const [loggedRepsBySeq, setLoggedRepsBySeq] = useState<Record<number, number>>({});
  const [showSafety, setShowSafety] = useState(false);
  const [finishedSummary, setFinishedSummary] = useState<WorkoutSessionRecord | null>(null);
  const prevRestRef = useRef(0);

  const exerciseMap = useMemo(() => {
    const map = new Map<string, Exercise>();
    exercises.forEach((e) => map.set(e.id, e));
    return map;
  }, [exercises]);

  const currentItem = program.exercises[currentIndex];
  const nextItem = program.exercises[currentIndex + 1];
  const currentExercise = currentItem ? exerciseMap.get(currentItem.exerciseId) : undefined;
  const nextExercise = nextItem ? exerciseMap.get(nextItem.exerciseId) : undefined;

  useEffect(() => {
    if (isPaused || finishedSummary) return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setRestSecondsLeft((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPaused, finishedSummary]);

  useEffect(() => {
    if (prevRestRef.current > 0 && restSecondsLeft === 0 && soundEnabled) {
      playSoftRestChime();
    }
    prevRestRef.current = restSecondsLeft;
  }, [restSecondsLeft, soundEnabled]);

  if (!currentItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-[#F7F9F6] font-semibold">This program has no assigned exercises yet.</p>
        <button
          type="button"
          onClick={onExit}
          className="mt-4 px-5 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold cursor-pointer"
        >
          Back to Workouts
        </button>
      </div>
    );
  }

  const completedSets = completedSetsBySeq[currentItem.sequence] ?? 0;
  const activeTargetValue =
    loggedRepsBySeq[currentItem.sequence] ??
    currentItem.reps ??
    currentItem.durationSeconds ??
    12;

  const totalExercisesCompleted = program.exercises.filter(
    (item) => (completedSetsBySeq[item.sequence] ?? 0) >= item.sets
  ).length;

  const handleLogSet = () => {
    const nextCount = Math.min(currentItem.sets, completedSets + 1);
    setCompletedSetsBySeq((prev) => ({
      ...prev,
      [currentItem.sequence]: nextCount,
    }));
    if (nextCount <= currentItem.sets) {
      setRestSecondsLeft(currentItem.restSeconds);
    }
  };

  const adjustActualTarget = (delta: number) => {
    setLoggedRepsBySeq((prev) => ({
      ...prev,
      [currentItem.sequence]: Math.max(1, activeTargetValue + delta),
    }));
  };

  const handleFinish = () => {
    const days: WorkoutSessionRecord['dayOfWeek'][] = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];
    const now = new Date();
    const record: WorkoutSessionRecord = {
      id: `sess-${Date.now()}`,
      programId: program.id,
      programTitle: program.title,
      categoryLabel: program.categoryLabel,
      completedAt: now.toISOString(),
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60) || program.durationMinutes),
      exercisesCompleted: Math.max(1, totalExercisesCompleted || currentIndex + 1),
      totalExercises: program.exercises.length,
      dayOfWeek: days[now.getDay()],
    };
    onCompleteSession(record);
    setFinishedSummary(record);
  };

  if (finishedSummary) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="rounded-[18px] border border-[#232A26] bg-[#151917] p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#48C774]/15 text-[#48C774] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold text-[#F7F9F6]">
            Workout Completed
          </h1>
          <p className="mt-2 text-sm text-[#A1AAA3]">
            Your session for <strong className="text-[#F7F9F6]">{finishedSummary.programTitle}</strong> has been recorded to your progress ledger.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-[#232A26] py-5">
            <div>
              <p className="font-mono-tabular text-2xl font-semibold text-[#B8F34A]">
                {finishedSummary.durationMinutes} min
              </p>
              <p className="mt-1 text-xs text-[#A1AAA3]">Logged Duration</p>
            </div>
            <div>
              <p className="font-mono-tabular text-2xl font-semibold text-[#F7F9F6]">
                {finishedSummary.exercisesCompleted}/{finishedSummary.totalExercises}
              </p>
              <p className="mt-1 text-xs text-[#A1AAA3]">Exercises Finished</p>
            </div>
            <div>
              <p className="font-mono-tabular text-2xl font-semibold text-[#48C774]">Saved</p>
              <p className="mt-1 text-xs text-[#A1AAA3]">Progress Updated</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onExit}
              className="px-6 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] cursor-pointer"
            >
              Return to Member Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Player Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#232A26]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-[#232A26] text-xs font-medium text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Player
          </button>
          <div>
            <p className="text-xs text-[#A1AAA3]">
              {program.categoryLabel} · Exercise {currentIndex + 1} of {program.exercises.length}
            </p>
            <h1 className="font-display text-2xl font-bold text-[#F7F9F6]">{program.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-2.5 rounded-[10px] border border-[#232A26] bg-[#151917] text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
            aria-label={soundEnabled ? 'Mute rest timer chime' : 'Enable rest timer chime'}
            title={soundEnabled ? 'Rest chime enabled' : 'Rest chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#B8F34A]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="px-4 py-2 rounded-[10px] border border-[#232A26] bg-[#151917] flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#B8F34A]" />
            <span className="font-mono-tabular text-base font-semibold text-[#F7F9F6]">
              {formatClock(elapsedSeconds)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#232A26] bg-[#151917] text-xs font-semibold text-[#F7F9F6] hover:border-[#B8F34A] cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-[#B8F34A]" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="px-4 py-2 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold hover:bg-[#c8f76c] cursor-pointer"
          >
            Finish Workout
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Exercise Visual + Cues */}
        <div className="lg:col-span-7 space-y-5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] border border-[#232A26] bg-[#151917]">
            <ImageWithFallback
              src={currentExercise?.imageUrl || program.thumbnailUrl}
              alt={currentExercise?.name || 'Exercise demonstration'}
              className="w-full h-full object-cover"
              fallbackTitle={currentExercise?.name}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0B0D0C] via-[#0B0D0C]/75 to-transparent">
              <p className="text-xs text-[#B8F34A] font-medium">
                {currentExercise?.muscleGroup || 'Full Body'} · {currentExercise?.equipment || program.equipment}
              </p>
              <h2 className="font-display text-3xl font-extrabold text-[#F7F9F6]">
                {currentExercise?.name || 'Guided Exercise'}
              </h2>
            </div>
          </div>

          {/* Form Cues & Safety Toggle */}
          <div className="rounded-[16px] border border-[#232A26] bg-[#151917] p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-sm font-semibold text-[#F7F9F6]">Execution Cues</h3>
              <button
                type="button"
                onClick={() => setShowSafety((s) => !s)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B8F34A] hover:underline cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {showSafety ? 'Hide Safety Note' : 'View Safety Note'}
              </button>
            </div>

            {showSafety && currentExercise && (
              <div className="mb-4 rounded-[10px] border border-[#232A26] bg-[#1D231F] p-3.5 text-xs text-[#A1AAA3]">
                <strong className="text-[#F7F9F6]">Safety reminder: </strong>
                {currentExercise.safetyNotes}
              </div>
            )}

            <ol className="space-y-2.5 text-sm text-[#A1AAA3]">
              {(currentExercise?.instructions || [program.description]).map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-mono-tabular text-xs text-[#B8F34A] mt-0.5">0{idx + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: Active Set Logger + Rest Countdown + Queue */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-[16px] border border-[#232A26] bg-[#151917] p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#232A26]">
              <div>
                <p className="text-xs text-[#A1AAA3]">Target Prescription</p>
                <p className="font-mono-tabular text-2xl font-semibold text-[#F7F9F6] mt-0.5">
                  {currentItem.sets} sets × {activeTargetValue}{' '}
                  {currentItem.reps ? 'reps' : 's hold'}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => adjustActualTarget(-1)}
                  className="w-8 h-8 rounded-[8px] border border-[#232A26] bg-[#0B0D0C] flex items-center justify-center text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
                  aria-label="Decrease reps or seconds"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustActualTarget(1)}
                  className="w-8 h-8 rounded-[8px] border border-[#232A26] bg-[#0B0D0C] flex items-center justify-center text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
                  aria-label="Increase reps or seconds"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Set progress blocks */}
            <div className="mt-4 flex items-center justify-between text-xs text-[#A1AAA3] mb-2">
              <span>Set Progress</span>
              <span className="font-mono-tabular text-[#B8F34A] font-semibold">
                {completedSets}/{currentItem.sets} sets
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: currentItem.sets }).map((_, idx) => {
                const done = idx < completedSets;
                return (
                  <div
                    key={idx}
                    className={`h-2.5 rounded-full transition-colors ${
                      done ? 'bg-[#B8F34A]' : 'bg-[#232A26]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Rest Countdown */}
            <div className="mt-5 rounded-[12px] border border-[#232A26] bg-[#0B0D0C] p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#A1AAA3]">Rest Countdown</p>
                <p
                  className={`font-mono-tabular text-3xl font-bold mt-0.5 ${
                    restSecondsLeft > 0 ? 'text-[#B8F34A]' : 'text-[#F7F9F6]'
                  }`}
                >
                  {formatClock(restSecondsLeft)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRestSecondsLeft(currentItem.restSeconds)}
                  className="px-3 py-2 rounded-[8px] border border-[#232A26] text-xs font-medium text-[#F7F9F6] hover:border-[#B8F34A] cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {currentItem.restSeconds}s
                </button>
                {restSecondsLeft > 0 && (
                  <button
                    type="button"
                    onClick={() => setRestSecondsLeft(0)}
                    className="px-3 py-2 rounded-[8px] bg-[#1D231F] text-xs font-medium text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>

            {/* Primary Set Action */}
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                disabled={completedSets >= currentItem.sets}
                onClick={handleLogSet}
                className="w-full py-3 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {completedSets >= currentItem.sets
                  ? 'All Sets Completed'
                  : `Complete Set ${completedSets + 1} & Start ${currentItem.restSeconds}s Rest`}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    setCurrentIndex((i) => Math.max(0, i - 1));
                    setRestSecondsLeft(0);
                  }}
                  className="py-2.5 rounded-[10px] border border-[#232A26] text-xs font-medium text-[#F7F9F6] hover:border-[#A1AAA3] disabled:opacity-40 inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Exercise
                </button>
                <button
                  type="button"
                  disabled={currentIndex === program.exercises.length - 1}
                  onClick={() => {
                    setCurrentIndex((i) => Math.min(program.exercises.length - 1, i + 1));
                    setRestSecondsLeft(0);
                  }}
                  className="py-2.5 rounded-[10px] border border-[#232A26] text-xs font-medium text-[#F7F9F6] hover:border-[#B8F34A] disabled:opacity-40 inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  Next Exercise
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {nextExercise && (
              <div className="mt-4 pt-4 border-t border-[#232A26] flex items-center justify-between text-xs text-[#A1AAA3]">
                <span>Up next</span>
                <span className="text-[#F7F9F6] font-medium truncate max-w-[220px]">
                  {nextExercise.name}
                </span>
              </div>
            )}
          </div>

          {/* Program Queue */}
          <div className="rounded-[16px] border border-[#232A26] bg-[#151917] p-5">
            <h3 className="text-xs font-semibold text-[#A1AAA3] uppercase tracking-wider mb-3">
              Session Sequence
            </h3>
            <div className="space-y-2">
              {program.exercises.map((item, idx) => {
                const ex = exerciseMap.get(item.exerciseId);
                const doneSets = completedSetsBySeq[item.sequence] ?? 0;
                const isDone = doneSets >= item.sets;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={item.sequence}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full px-3.5 py-2.5 rounded-[10px] border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isCurrent
                        ? 'border-[#B8F34A] bg-[#1D231F]'
                        : 'border-[#232A26] bg-[#0B0D0C] hover:border-[#A1AAA3]/60'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F7F9F6] truncate">
                        0{item.sequence}. {ex?.name || 'Exercise'}
                      </p>
                      <p className="font-mono-tabular text-[11px] text-[#A1AAA3]">
                        {doneSets}/{item.sets} sets
                      </p>
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-[#48C774] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
