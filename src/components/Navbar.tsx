import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppView } from '../types/fitpro';

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onStartTraining: () => void;
  hasActiveSession: boolean;
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'workouts', label: 'Workouts' },
  { id: 'exercises', label: 'Exercises' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'admin', label: 'Admin' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  onStartTraining,
  hasActiveSession,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (view: AppView) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D0C]/95 backdrop-blur-md border-b border-[#29312B]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Single clean wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="font-display text-2xl font-extrabold tracking-tight text-[#F7F9F6] hover:text-[#B8F34A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          FitPro
        </button>

        {/* Zone 2: 5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-[#F7F9F6] border-[#B8F34A]'
                    : 'text-[#A1AAA3] border-transparent hover:text-[#F7F9F6] hover:border-[#29312B]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartTraining}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] hover:bg-[#c8f76c] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {hasActiveSession ? 'Resume Workout' : 'Start Training'}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#29312B] text-[#F7F9F6] hover:bg-[#151917] transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#29312B] bg-[#0B0D0C] px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
                activeView === item.id
                  ? 'bg-[#151917] text-[#B8F34A]'
                  : 'text-[#A1AAA3] hover:text-[#F7F9F6] hover:bg-[#151917]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onStartTraining();
            }}
            className="w-full mt-2 px-4 py-2.5 rounded-[10px] text-sm font-semibold bg-[#B8F34A] text-[#0B0D0C]"
          >
            {hasActiveSession ? 'Resume Workout' : 'Start Training'}
          </button>
        </div>
      )}
    </header>
  );
};
