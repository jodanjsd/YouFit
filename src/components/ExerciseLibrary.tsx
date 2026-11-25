import React, { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, Search, ShieldCheck, X } from 'lucide-react';
import { Exercise } from '../types/fitpro';
import { ImageWithFallback } from './ImageWithFallback';

interface ExerciseLibraryProps {
  exercises: Exercise[];
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ exercises }) => {
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('All');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('All');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const muscleOptions = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Full Body'];
  const equipmentOptions = ['All', 'Barbell', 'Kettlebell', 'Dumbbells', 'Battle Ropes', 'Bodyweight', 'Mat'];

  const filtered = useMemo(() => {
    return exercises
      .filter((ex) => (muscleFilter === 'All' ? true : ex.muscleGroup === muscleFilter))
      .filter((ex) => (equipmentFilter === 'All' ? true : ex.equipment === equipmentFilter))
      .filter((ex) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          ex.name.toLowerCase().includes(q) ||
          ex.description.toLowerCase().includes(q) ||
          ex.muscleGroup.toLowerCase().includes(q)
        );
      });
  }, [exercises, muscleFilter, equipmentFilter, search]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#29312B]">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F7F9F6]">
            Exercise Library
          </h1>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Step-by-step execution cues, common form errors, and safety modifications.
          </p>
        </div>
        <p className="text-xs text-[#A1AAA3] font-mono-tabular">
          {filtered.length} {filtered.length === 1 ? 'exercise' : 'exercises'} shown
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A1AAA3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by exercise or muscle group..."
            aria-label="Search exercises"
            className="w-full h-11 pl-10 pr-4 rounded-[10px] border border-[#29312B] bg-[#151917] text-sm text-[#F7F9F6] placeholder:text-[#A1AAA3]/60 focus:border-[#B8F34A] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex flex-wrap items-center p-1 rounded-[10px] border border-[#29312B] bg-[#151917]">
            {muscleOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMuscleFilter(m)}
                className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  muscleFilter === m ? 'bg-[#B8F34A] text-[#0B0D0C]' : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <label className="sr-only" htmlFor="equipment-select">
            Filter by equipment
          </label>
          <select
            id="equipment-select"
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="h-10 px-3 rounded-[10px] border border-[#29312B] bg-[#151917] text-xs font-medium text-[#F7F9F6] focus:border-[#B8F34A] focus:outline-none"
          >
            {equipmentOptions.map((eq) => (
              <option key={eq} value={eq}>
                {eq === 'All' ? 'All Equipment' : eq}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercise Cards */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-[16px] border border-[#29312B] bg-[#151917] p-12 text-center">
          <p className="text-base font-semibold text-[#F7F9F6]">No exercises match those filters</p>
          <p className="mt-1 text-sm text-[#A1AAA3]">Reset equipment or muscle filters to browse all movements.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setMuscleFilter('All');
              setEquipmentFilter('All');
            }}
            className="mt-4 px-4 py-2 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => setActiveExercise(ex)}
              className="group text-left rounded-[16px] border border-[#29312B] bg-[#151917] overflow-hidden flex flex-col justify-between hover:border-[#B8F34A]/60 transition-colors cursor-pointer"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={ex.imageUrl}
                    alt={ex.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    fallbackTitle={ex.name}
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#A1AAA3]">
                    <span className="text-[#F7F9F6] font-medium">{ex.muscleGroup}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ex.equipment}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ex.difficulty}</span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold text-[#F7F9F6] leading-snug">
                    {ex.name}
                  </h2>
                  <p className="mt-1.5 text-xs text-[#A1AAA3] line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-4 pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#B8F34A]">
                <BookOpen className="w-3.5 h-3.5" />
                View Form Cues
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {activeExercise && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exercise-detail-title"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[18px] border border-[#29312B] bg-[#151917] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#A1AAA3]">
                  <span className="text-[#B8F34A] font-medium">{activeExercise.muscleGroup}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeExercise.equipment}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeExercise.difficulty}</span>
                </div>
                <h2
                  id="exercise-detail-title"
                  className="mt-2 font-display text-3xl font-extrabold text-[#F7F9F6]"
                >
                  {activeExercise.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveExercise(null)}
                className="w-9 h-9 rounded-[10px] border border-[#29312B] flex items-center justify-center text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer shrink-0"
                aria-label="Close exercise guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 aspect-[16/9] overflow-hidden rounded-[12px] border border-[#29312B]">
              <ImageWithFallback
                src={activeExercise.imageUrl}
                alt={activeExercise.name}
                className="w-full h-full object-cover"
                fallbackTitle={activeExercise.name}
              />
            </div>

            <p className="mt-4 text-sm text-[#A1AAA3] leading-relaxed">{activeExercise.description}</p>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-[#F7F9F6] mb-2">Execution Steps</h3>
                <ol className="space-y-2 text-sm text-[#A1AAA3]">
                  {activeExercise.instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono-tabular text-xs text-[#B8F34A] mt-0.5">0{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[12px] border border-[#29312B] bg-[#0B0D0C] p-4">
                <h3 className="text-xs font-semibold text-[#F7F9F6] flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#F05C5C]" />
                  Common Mistakes to Avoid
                </h3>
                <ul className="space-y-1.5 text-xs text-[#A1AAA3]">
                  {activeExercise.commonMistakes.map((mistake, i) => (
                    <li key={i}>• {mistake}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[12px] border border-[#29312B] bg-[#1D231F] p-4 flex items-start gap-2.5 text-xs text-[#A1AAA3]">
                <ShieldCheck className="w-4 h-4 text-[#48C774] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F7F9F6] font-medium">Safety note: </strong>
                  {activeExercise.safetyNotes}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
