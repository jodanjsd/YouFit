import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  AdminUserRecord,
  AppView,
  Article,
  CategorySlug,
  MemberProfile,
  PaymentTransaction,
  SubscriptionPlan,
  WorkoutProgram,
  WorkoutSessionRecord,
} from './types/fitpro';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ARTICLES,
  INITIAL_EXERCISES,
  INITIAL_MEMBER_PROFILE,
  INITIAL_PAYMENTS,
  INITIAL_PROGRAMS,
  INITIAL_SESSIONS,
  SUBSCRIPTION_PLANS,
} from './data/fitproSeed';
import { Navbar } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { WorkoutLibrary } from './components/WorkoutLibrary';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { MemberDashboard } from './components/MemberDashboard';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { PricingCheckout } from './components/PricingCheckout';
import { AdminDashboard } from './components/AdminDashboard';
import { OnboardingModal } from './components/OnboardingModal';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');
  const [activePlayerProgram, setActivePlayerProgram] = useState<WorkoutProgram | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [profile, setProfile] = useState<MemberProfile>(() =>
    loadStored('fitpro_profile_v1', INITIAL_MEMBER_PROFILE)
  );
  const [programs, setPrograms] = useState<WorkoutProgram[]>(() =>
    loadStored('fitpro_programs_v1', INITIAL_PROGRAMS)
  );
  const [sessions, setSessions] = useState<WorkoutSessionRecord[]>(() =>
    loadStored('fitpro_sessions_v1', INITIAL_SESSIONS)
  );
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    loadStored('fitpro_saved_v1', ['prog-fullbody-foundation'])
  );
  const [payments, setPayments] = useState<PaymentTransaction[]>(() =>
    loadStored('fitpro_payments_v1', INITIAL_PAYMENTS)
  );
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(() =>
    loadStored('fitpro_users_v1', INITIAL_ADMIN_USERS)
  );
  const [articles, setArticles] = useState<Article[]>(() =>
    loadStored('fitpro_articles_v1', INITIAL_ARTICLES)
  );

  useEffect(() => {
    window.localStorage.setItem('fitpro_profile_v1', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    window.localStorage.setItem('fitpro_programs_v1', JSON.stringify(programs));
  }, [programs]);
  useEffect(() => {
    window.localStorage.setItem('fitpro_sessions_v1', JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    window.localStorage.setItem('fitpro_saved_v1', JSON.stringify(savedIds));
  }, [savedIds]);
  useEffect(() => {
    window.localStorage.setItem('fitpro_payments_v1', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    window.localStorage.setItem('fitpro_users_v1', JSON.stringify(adminUsers));
  }, [adminUsers]);
  useEffect(() => {
    window.localStorage.setItem('fitpro_articles_v1', JSON.stringify(articles));
  }, [articles]);

  const showNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => {
      setNotice((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartWorkout = (program: WorkoutProgram) => {
    if (program.isPremium && profile.membershipTier !== 'premium') {
      showNotice('This program requires FitPro Premium. Choose a plan to unlock.');
      handleNavigate('pricing');
      return;
    }
    setActivePlayerProgram(program);
    handleNavigate('player');
  };

  const handleToggleSave = (programId: string) => {
    setSavedIds((prev) => {
      if (prev.includes(programId)) {
        showNotice('Removed from saved workouts.');
        return prev.filter((id) => id !== programId);
      }
      if (profile.membershipTier === 'free' && prev.length >= 3) {
        showNotice('Free Starter is limited to 3 saved workouts. Upgrade for unlimited saves.');
        return prev;
      }
      showNotice('Saved to your Member Dashboard.');
      return [...prev, programId];
    });
  };

  const handleCompleteSession = (record: WorkoutSessionRecord) => {
    setSessions((prev) => [record, ...prev]);
    setActivePlayerProgram(null);
    showNotice(`Session logged: ${record.programTitle} (${record.durationMinutes} min).`);
  };

  const handleActivatePlan = (
    plan: SubscriptionPlan,
    channel: 'Card' | 'Bank Transfer' | 'USSD'
  ) => {
    const isPremium = plan.priceNgn > 0;
    setProfile((prev) => ({
      ...prev,
      membershipTier: isPremium ? 'premium' : 'free',
      planName: plan.name,
      renewalDate: isPremium ? 'Dec 25, 2026' : null,
    }));

    if (isPremium) {
      const tx: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        reference: `FP-PSK-${Math.floor(100000 + Math.random() * 900000)}`,
        memberName: profile.fullName,
        memberEmail: profile.email,
        planName: plan.name,
        amountNgn: plan.priceNgn,
        channel,
        status: 'success',
        paidAt: 'Just now',
      };
      setPayments((prev) => [tx, ...prev]);
      showNotice(`Paystack verified. ${plan.name} is now active.`);
    } else {
      showNotice('Switched to Free Starter membership.');
    }
  };

  const handleStartTrainingAction = () => {
    if (activePlayerProgram) {
      handleNavigate('player');
      return;
    }
    const starter = programs.find((p) => p.isPublished && !p.isPremium) || programs[0];
    if (starter) {
      handleStartWorkout(starter);
    } else {
      handleNavigate('workouts');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D0C] text-[#F7F9F6] flex flex-col">
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        onStartTraining={handleStartTrainingAction}
        hasActiveSession={Boolean(activePlayerProgram)}
      />

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-[12px] border border-[#B8F34A]/60 bg-[#151917] px-4 py-3 shadow-lg flex items-center gap-2.5 text-xs font-medium text-[#F7F9F6]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#B8F34A] shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <main className="flex-1">
        {activeView === 'home' && (
          <PublicHome
            programs={programs}
            articles={articles}
            isPremiumMember={profile.membershipTier === 'premium'}
            onNavigate={handleNavigate}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigate('workouts');
            }}
            onSelectProgram={handleStartWorkout}
            onOpenOnboarding={() => setOnboardingOpen(true)}
          />
        )}

        {activeView === 'workouts' && (
          <WorkoutLibrary
            programs={programs}
            exercises={INITIAL_EXERCISES}
            savedIds={savedIds}
            isPremiumMember={profile.membershipTier === 'premium'}
            initialCategory={selectedCategory}
            onClearCategoryFilter={() => setSelectedCategory('all')}
            onToggleSave={handleToggleSave}
            onStartWorkout={handleStartWorkout}
            onGoToPricing={() => handleNavigate('pricing')}
          />
        )}

        {activeView === 'exercises' && <ExerciseLibrary exercises={INITIAL_EXERCISES} />}

        {activeView === 'dashboard' && (
          <MemberDashboard
            profile={profile}
            programs={programs}
            sessions={sessions}
            payments={payments}
            savedIds={savedIds}
            onStartWorkout={handleStartWorkout}
            onOpenOnboarding={() => setOnboardingOpen(true)}
            onUpdateProfile={(updated) => {
              setProfile((prev) => ({ ...prev, ...updated }));
              showNotice('Profile preferences saved.');
            }}
            onCancelMembership={() => {
              setProfile((prev) => ({
                ...prev,
                membershipTier: 'free',
                planName: 'Free Starter',
                renewalDate: null,
              }));
              showNotice('Downgraded to Free Starter membership.');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'player' && activePlayerProgram && (
          <WorkoutPlayer
            program={activePlayerProgram}
            exercises={INITIAL_EXERCISES}
            onCompleteSession={handleCompleteSession}
            onExit={() => {
              setActivePlayerProgram(null);
              handleNavigate('dashboard');
            }}
          />
        )}

        {activeView === 'player' && !activePlayerProgram && (
          <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <h1 className="font-display text-3xl font-bold text-[#F7F9F6]">No Active Workout</h1>
            <p className="mt-2 text-sm text-[#A1AAA3]">
              Select any program from the library or your dashboard to start the workout player.
            </p>
            <button
              type="button"
              onClick={() => handleNavigate('workouts')}
              className="mt-5 px-5 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold cursor-pointer"
            >
              Browse Workouts
            </button>
          </div>
        )}

        {activeView === 'pricing' && (
          <PricingCheckout
            plans={SUBSCRIPTION_PLANS}
            profile={profile}
            payments={payments}
            onActivatePlan={handleActivatePlan}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            programs={programs}
            users={adminUsers}
            payments={payments}
            articles={articles}
            totalSessionsLogged={sessions.length + 37}
            onToggleProgramPublish={(id) => {
              setPrograms((prev) =>
                prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
              );
              showNotice('Program visibility updated.');
            }}
            onToggleProgramTier={(id) => {
              setPrograms((prev) =>
                prev.map((p) => (p.id === id ? { ...p, isPremium: !p.isPremium } : p))
              );
              showNotice('Program membership tier updated.');
            }}
            onCreateProgram={(created) => {
              setPrograms((prev) => [created, ...prev]);
              showNotice(`Published "${created.title}" to Workout Library.`);
            }}
            onToggleUserStatus={(id) => {
              setAdminUsers((prev) =>
                prev.map((u) =>
                  u.id === id
                    ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
                    : u
                )
              );
              showNotice('Member account status updated.');
            }}
            onToggleArticleStatus={(id) => {
              setArticles((prev) =>
                prev.map((a) =>
                  a.id === id
                    ? { ...a, status: a.status === 'published' ? 'draft' : 'published' }
                    : a
                )
              );
              showNotice('Article visibility updated.');
            }}
          />
        )}
      </main>

      {onboardingOpen && (
        <OnboardingModal
          profile={profile}
          onClose={() => setOnboardingOpen(false)}
          onComplete={(updated) => {
            setProfile((prev) => ({ ...prev, ...updated }));
            setOnboardingOpen(false);
            showNotice('Training preferences updated.');
            handleNavigate('dashboard');
          }}
        />
      )}
    </div>
  );
}
