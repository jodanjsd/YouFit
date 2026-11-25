import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  Clock,
  Dumbbell,
  Lock,
  Play,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import {
  CategorySlug,
  DifficultyLevel,
  Exercise,
  WorkoutProgram,
} from '../types/fitpro';
import { ImageWithFallback } from './ImageWithFallback';

interface WorkoutLibraryProps {
  programs: WorkoutProgram[];
  exercises: Exercise[];
  savedIds: string[];
  isPremiumMember: boolean;
  initialCategory: CategorySlug | 'all';
  onClearCategoryFilter: () => void;
  onToggleSave: (programId: string) => void;
  onStartWorkout: (program: WorkoutProgram) => void;
  onGoToPricing: () => void;
}

export const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({
  programs,
  exercises,
  savedIds,
  isPremiumMember,
  initialCategory,
  onClearCategoryFilter,
  onToggleSave,
  onStartWorkout,
  onGoToPricing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategorySlug | 'all'>(initialCategory);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'standard'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'shortest' | 'longest'>('featured');
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);

  const exerciseLookup = useMemo(() => {
    const map = new Map<string, Exercise>();
    exercises.forEach((ex) => map.set(ex.id, ex));
    return map;
  }, [exercises]);

  const filteredPrograms = useMemo(() => {
    const base = programs
      .filter((p) => p.isPublished)
      .filter((p) => (categoryFilter === 'all' ? true : p.category === categoryFilter))
      .filter((p) => (difficultyFilter === 'all' ? true : p.difficulty === difficultyFilter))
      .filter((p) => {
        if (durationFilter === 'short') return p.durationMinutes <= 25;
        if (durationFilter === 'standard') return p.durationMinutes >= 30;
        return true;
      })
      .filter((p) => {
        if (tierFilter === 'free') return !p.isPremium;
        if (tierFilter === 'premium') return p.isPremium;
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.equipment.toLowerCase().includes(q) ||
          p.targetMuscles.toLowerCase().includes(q)
        );
      });

    if (sortBy === 'shortest') {
      return [...base].sort((a, b) => a.durationMinutes - b.durationMinutes);
    }
    if (sortBy === 'longest') {
      return [...base].sort((a, b) => b.durationMinutes - a.durationMinutes);
    }
    return base;
  }, [programs, categoryFilter, difficultyFilter, durationFilter, tierFilter, searchQuery, sortBy]);

  const handleCategoryChange = (cat: CategorySlug | 'all') => {
    setCategoryFilter(cat);
    if (cat === 'all') onClearCategoryFilter();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#232A26]">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F7F9F6]">
            Workout Programs
          </h1>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Filter structured programs by discipline, duration, difficulty, and membership access.
          </p>
        </div>
        <p className="text-xs text-[#A1AAA3] font-mono-tabular">
          {filteredPrograms.length} {filteredPrograms.length === 1 ? 'program' : 'programs'} available
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A1AAA3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workouts, equipment, or muscles..."
              aria-label="Search workouts"
              className="w-full h-11 pl-10 pr-4 rounded-[10px] border border-[#232A26] bg-[#151917] text-sm text-[#F7F9F6] placeholder:text-[#A1AAA3]/60 focus:border-[#B8F34A] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center p-1 rounded-[10px] border border-[#232A26] bg-[#151917]">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'strength', label: 'Strength' },
                  { id: 'cardio', label: 'Cardio' },
                  { id: 'mobility', label: 'Mobility' },
                  { id: 'home', label: 'Home' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-[#B8F34A] text-[#0B0D0C]'
                      : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <label className="sr-only" htmlFor="sort-workouts">
              Sort workouts
            </label>
            <select
              id="sort-workouts"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'shortest' | 'longest')}
              className="h-10 px-3 rounded-[10px] border border-[#232A26] bg-[#151917] text-xs font-medium text-[#F7F9F6] focus:border-[#B8F34A] focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="shortest">Duration: Shortest first</option>
              <option value="longest">Duration: Longest first</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center p-1 rounded-[10px] border border-[#232A26] bg-[#151917]">
            {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficultyFilter(lvl)}
                className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficultyFilter === lvl
                    ? 'bg-[#1D231F] text-[#F7F9F6] border border-[#29312B]'
                    : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
                }`}
              >
                {lvl === 'all' ? 'Any Level' : lvl}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center p-1 rounded-[10px] border border-[#232A26] bg-[#151917]">
            {(
              [
                { id: 'all', label: 'Any Length' },
                { id: 'short', label: '≤ 25 min' },
                { id: 'standard', label: '30+ min' },
              ] as const
            ).map((dur) => (
              <button
                key={dur.id}
                type="button"
                onClick={() => setDurationFilter(dur.id)}
                className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  durationFilter === dur.id
                    ? 'bg-[#1D231F] text-[#F7F9F6] border border-[#29312B]'
                    : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center p-1 rounded-[10px] border border-[#232A26] bg-[#151917]">
            {(['all', 'free', 'premium'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors capitalize whitespace-nowrap shrink-0 cursor-pointer ${
                  tierFilter === tier
                    ? 'bg-[#1D231F] text-[#F7F9F6] border border-[#29312B]'
                    : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
                }`}
              >
                {tier === 'all' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredPrograms.length === 0 ? (
        <div className="mt-10 rounded-[16px] border border-[#232A26] bg-[#151917] p-12 text-center">
          <Dumbbell className="w-8 h-8 text-[#A1AAA3] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#F7F9F6]">No matching workout programs</h2>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Adjust your category, duration, difficulty, or search query to view available training plans.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('all');
              setDifficultyFilter('all');
              setDurationFilter('all');
              setTierFilter('all');
            }}
            className="mt-5 px-4 py-2 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const isSaved = savedIds.includes(program.id);
            const isLocked = program.isPremium && !isPremiumMember;

            return (
              <article
                key={program.id}
                className="rounded-[16px] border border-[#232A26] bg-[#151917] overflow-hidden flex flex-col justify-between hover:border-[#3A463F] transition-colors"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={program.thumbnailUrl}
                      alt={program.title}
                      className="w-full h-full object-cover"
                      fallbackTitle={program.title}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#A1AAA3]">
                        <span className="text-[#F7F9F6] font-medium">{program.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{program.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{program.durationMinutes} min</span>
                        <span aria-hidden="true">·</span>
                        <span className={program.isPremium ? 'text-[#B8F34A] font-medium' : 'text-[#A1AAA3]'}>
                          {program.isPremium ? 'Premium' : 'Free'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSave(program.id)}
                        className={`p-2 rounded-[8px] border transition-colors cursor-pointer shrink-0 ${
                          isSaved
                            ? 'border-[#B8F34A] text-[#B8F34A] bg-[#1D231F]'
                            : 'border-[#232A26] text-[#A1AAA3] hover:text-[#F7F9F6]'
                        }`}
                        aria-label={isSaved ? 'Remove from saved workouts' : 'Save workout'}
                      >
                        <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <h2 className="mt-2 font-display text-2xl font-bold text-[#F7F9F6] leading-tight">
                      {program.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#A1AAA3] leading-relaxed line-clamp-2">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#232A26] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProgram(program)}
                    className="text-sm font-medium text-[#F7F9F6] hover:text-[#B8F34A] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    View Details
                  </button>

                  {isLocked ? (
                    <button
                      type="button"
                      onClick={() => setSelectedProgram(program)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#2F3933] bg-[#1D231F] text-xs font-semibold text-[#F7F9F6] hover:border-[#B8F34A] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#B8F34A]" />
                      Unlock Premium
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStartWorkout(program)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold hover:bg-[#c8f76c] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Start Workout
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Workout Details Modal */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="workout-detail-title"
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[18px] border border-[#29312B] bg-[#151917] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#A1AAA3]">
                  <span className="text-[#F7F9F6] font-medium">{selectedProgram.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedProgram.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedProgram.durationMinutes} min
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className={selectedProgram.isPremium ? 'text-[#B8F34A] font-medium' : 'text-[#48C774] font-medium'}>
                    {selectedProgram.isPremium ? 'Premium Program' : 'Free Access'}
                  </span>
                </div>
                <h2
                  id="workout-detail-title"
                  className="mt-2 font-display text-3xl font-extrabold text-[#F7F9F6]"
                >
                  {selectedProgram.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="w-9 h-9 rounded-[10px] border border-[#29312B] flex items-center justify-center text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer shrink-0"
                aria-label="Close workout details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 aspect-[4/3] overflow-hidden rounded-[12px] border border-[#29312B]">
                <ImageWithFallback
                  src={selectedProgram.thumbnailUrl}
                  alt={selectedProgram.title}
                  className="w-full h-full object-cover"
                  fallbackTitle={selectedProgram.title}
                />
              </div>
              <div className="md:col-span-7 space-y-3 text-sm">
                <p className="text-[#A1AAA3] leading-relaxed">{selectedProgram.description}</p>
                <div className="pt-2 border-t border-[#29312B] space-y-1.5 text-xs">
                  <p className="text-[#A1AAA3]">
                    <span className="text-[#F7F9F6] font-medium">Equipment:</span> {selectedProgram.equipment}
                  </p>
                  <p className="text-[#A1AAA3]">
                    <span className="text-[#F7F9F6] font-medium">Target muscles:</span> {selectedProgram.targetMuscles}
                  </p>
                </div>
                <div className="rounded-[10px] border border-[#29312B] bg-[#1D231F] p-3 flex items-start gap-2.5 text-xs text-[#A1AAA3]">
                  <ShieldAlert className="w-4 h-4 text-[#B8F34A] shrink-0 mt-0.5" />
                  <span>{selectedProgram.safetyNote}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[#F7F9F6] mb-3">
                Exercise Sequence ({selectedProgram.exercises.length})
              </h3>
              <div className="divide-y divide-[#29312B] rounded-[12px] border border-[#29312B] bg-[#0B0D0C]">
                {selectedProgram.exercises.map((item) => {
                  const ex = exerciseLookup.get(item.exerciseId);
                  return (
                    <div
                      key={`${selectedProgram.id}-${item.sequence}`}
                      className="px-4 py-3 flex items-center justify-between gap-4 text-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono-tabular text-xs text-[#A1AAA3] w-5">
                          0{item.sequence}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-[#F7F9F6] truncate">
                            {ex ? ex.name : 'Guided Exercise'}
                          </p>
                          <p className="text-xs text-[#A1AAA3]">
                            {ex ? `${ex.muscleGroup} · ${ex.equipment}` : 'Standard movement'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-mono-tabular text-xs text-[#A1AAA3] shrink-0">
                        <span className="text-[#F7F9F6]">
                          {item.sets} sets × {item.reps ? `${item.reps} reps` : `${item.durationSeconds}s`}
                        </span>
                        <span className="block text-[#A1AAA3]">{item.restSeconds}s rest</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#29312B] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onToggleSave(selectedProgram.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[#29312B] text-sm font-medium text-[#F7F9F6] hover:border-[#B8F34A] cursor-pointer"
              >
                {savedIds.includes(selectedProgram.id) ? (
                  <>
                    <Check className="w-4 h-4 text-[#B8F34A]" />
                    Saved to Library
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Save Workout
                  </>
                )}
              </button>

              {selectedProgram.isPremium && !isPremiumMember ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProgram(null);
                    onGoToPricing();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Upgrade to Premium (₦5,000/mo)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedProgram;
                    setSelectedProgram(null);
                    onStartWorkout(target);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  Launch Workout Player
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
