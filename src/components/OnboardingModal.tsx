import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import {
  DifficultyLevel,
  FitnessGoal,
  MemberProfile,
  WorkoutLocation,
} from '../types/fitpro';

interface OnboardingModalProps {
  profile: MemberProfile;
  onComplete: (updated: Partial<MemberProfile>) => void;
  onClose: () => void;
}

const GOALS: FitnessGoal[] = [
  'Build muscle',
  'Lose weight',
  'Improve strength',
  'Improve endurance',
  'Improve flexibility',
  'General fitness',
];

const LEVELS: { value: DifficultyLevel; desc: string }[] = [
  { value: 'Beginner', desc: 'New to structured training or returning after a break.' },
  { value: 'Intermediate', desc: 'Comfortable with compound lifts and 3+ sessions weekly.' },
  { value: 'Advanced', desc: 'Experienced lifter tracking sets, volume, and conditioning.' },
];

const LOCATIONS: { value: WorkoutLocation; desc: string }[] = [
  { value: 'Gym', desc: 'Access to barbells, racks, cables, and heavy kettlebells.' },
  { value: 'Home', desc: 'Bodyweight, mat, and optional dumbbells in your living space.' },
  { value: 'Hybrid', desc: 'Mix of gym strength days and quick home circuits.' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  profile,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(profile.fullName);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [level, setLevel] = useState<DifficultyLevel>(profile.experienceLevel);
  const [location, setLocation] = useState<WorkoutLocation>(profile.workoutLocation);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(profile.workoutsPerWeek);
  const [duration, setDuration] = useState<number>(profile.preferredDuration);

  const handleFinish = () => {
    onComplete({
      fullName: fullName.trim() || profile.fullName,
      goal,
      experienceLevel: level,
      workoutLocation: location,
      workoutsPerWeek: daysPerWeek,
      preferredDuration: duration,
      onboarded: true,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-xl rounded-[18px] border border-[#29312B] bg-[#151917] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#29312B]">
          <div>
            <p className="font-mono-tabular text-xs text-[#B8F34A]">Step {step} of 4</p>
            <h2 id="onboarding-title" className="font-display text-2xl font-bold text-[#F7F9F6]">
              Calibrate Your Training Plan
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-[10px] border border-[#29312B] flex items-center justify-center text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
            aria-label="Close onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 min-h-[240px]">
          {step === 1 && (
            <div>
              <label htmlFor="member-name" className="block text-xs font-medium text-[#A1AAA3] mb-1.5">
                Your Name
              </label>
              <input
                id="member-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-[10px] border border-[#29312B] bg-[#0B0D0C] text-sm text-[#F7F9F6] mb-5 focus:border-[#B8F34A] focus:outline-none"
              />
              <p className="text-sm font-semibold text-[#F7F9F6] mb-3">
                What is your primary fitness goal?
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {GOALS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGoal(item)}
                    className={`px-3.5 py-3 rounded-[10px] border text-left text-sm font-medium transition-colors cursor-pointer ${
                      goal === item
                        ? 'border-[#B8F34A] bg-[#1D231F] text-[#B8F34A]'
                        : 'border-[#29312B] bg-[#0B0D0C] text-[#F7F9F6] hover:border-[#A1AAA3]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-semibold text-[#F7F9F6] mb-3">
                What is your current training experience?
              </p>
              <div className="space-y-3">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => setLevel(lvl.value)}
                    className={`w-full p-4 rounded-[12px] border text-left transition-colors cursor-pointer ${
                      level === lvl.value
                        ? 'border-[#B8F34A] bg-[#1D231F]'
                        : 'border-[#29312B] bg-[#0B0D0C] hover:border-[#A1AAA3]'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${level === lvl.value ? 'text-[#B8F34A]' : 'text-[#F7F9F6]'}`}>
                      {lvl.value}
                    </p>
                    <p className="mt-1 text-xs text-[#A1AAA3]">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-semibold text-[#F7F9F6] mb-3">
                Where do you prefer to train?
              </p>
              <div className="space-y-3">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => setLocation(loc.value)}
                    className={`w-full p-4 rounded-[12px] border text-left transition-colors cursor-pointer ${
                      location === loc.value
                        ? 'border-[#B8F34A] bg-[#1D231F]'
                        : 'border-[#29312B] bg-[#0B0D0C] hover:border-[#A1AAA3]'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${location === loc.value ? 'text-[#B8F34A]' : 'text-[#F7F9F6]'}`}>
                      {loc.value}
                    </p>
                    <p className="mt-1 text-xs text-[#A1AAA3]">{loc.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-[#F7F9F6] mb-3">
                  How many days per week can you train?
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={`py-3 rounded-[10px] border font-mono-tabular text-sm font-semibold cursor-pointer ${
                        daysPerWeek === d
                          ? 'border-[#B8F34A] bg-[#B8F34A] text-[#0B0D0C]'
                          : 'border-[#29312B] bg-[#0B0D0C] text-[#F7F9F6]'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#F7F9F6] mb-3">
                  Preferred session duration?
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[20, 30, 35, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`py-3 rounded-[10px] border font-mono-tabular text-sm font-semibold cursor-pointer ${
                        duration === mins
                          ? 'border-[#B8F34A] bg-[#B8F34A] text-[#0B0D0C]'
                          : 'border-[#29312B] bg-[#0B0D0C] text-[#F7F9F6]'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#A1AAA3]">
                Your answers filter existing workout programs for convenience and are not a medical assessment.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-5 border-t border-[#29312B] flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#29312B] text-sm text-[#A1AAA3] hover:text-[#F7F9F6] disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
