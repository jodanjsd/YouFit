import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  AdminUserRecord,
  Article,
  CategorySlug,
  DifficultyLevel,
  PaymentTransaction,
  WorkoutProgram,
} from '../types/fitpro';
import { FITPRO_IMAGES } from '../data/fitproSeed';

interface AdminDashboardProps {
  programs: WorkoutProgram[];
  users: AdminUserRecord[];
  payments: PaymentTransaction[];
  articles: Article[];
  totalSessionsLogged: number;
  onToggleProgramPublish: (id: string) => void;
  onToggleProgramTier: (id: string) => void;
  onCreateProgram: (program: WorkoutProgram) => void;
  onToggleUserStatus: (id: string) => void;
  onToggleArticleStatus: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  programs,
  users,
  payments,
  articles,
  totalSessionsLogged,
  onToggleProgramPublish,
  onToggleProgramTier,
  onCreateProgram,
  onToggleUserStatus,
  onToggleArticleStatus,
}) => {
  const [tab, setTab] = useState<'workouts' | 'users' | 'payments' | 'articles'>('workouts');
  const [userSearch, setUserSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategorySlug>('strength');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('Beginner');
  const [newDuration, setNewDuration] = useState(25);
  const [newIsPremium, setNewIsPremium] = useState(false);

  const totalRevenueNgn = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'success')
        .reduce((sum, p) => sum + p.amountNgn, 0),
    [payments]
  );

  const activePremiumUsers = useMemo(
    () => users.filter((u) => u.tier === 'premium' && u.status === 'active').length,
    [users]
  );

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const categoryLabels: Record<CategorySlug, string> = {
      strength: 'Strength',
      cardio: 'Cardio & HIIT',
      mobility: 'Yoga & Mobility',
      home: 'Home Workouts',
    };
    const images: Record<CategorySlug, string> = {
      strength: FITPRO_IMAGES.strength,
      cardio: FITPRO_IMAGES.cardio,
      mobility: FITPRO_IMAGES.mobility,
      home: FITPRO_IMAGES.home,
    };

    const created: WorkoutProgram = {
      id: `prog-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      difficulty: newDifficulty,
      durationMinutes: Number(newDuration) || 25,
      equipment: newCategory === 'home' ? 'Bodyweight & Mat' : 'Gym Equipment',
      targetMuscles: 'Full Body',
      description: 'Admin-authored FitPro training program ready for member sessions.',
      safetyNote: 'Warm up 5 minutes before beginning working sets.',
      thumbnailUrl: images[newCategory],
      isPremium: newIsPremium,
      isPublished: true,
      exercises: [
        { exerciseId: 'ex-pushup-tempo', sequence: 1, sets: 3, reps: 12, durationSeconds: null, restSeconds: 45 },
        { exerciseId: 'ex-goblet-squat', sequence: 2, sets: 3, reps: 12, durationSeconds: null, restSeconds: 45 },
      ],
    };

    onCreateProgram(created);
    setNewTitle('');
    setShowNewForm(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#29312B]">
        <div>
          <p className="text-xs text-[#B8F34A] font-medium">Admin Operations Console</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F7F9F6]">
            Platform Management
          </h1>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Manage workout publishing, member accounts, Paystack transactions, and articles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTab('workouts');
            setShowNewForm((prev) => !prev);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold hover:bg-[#c8f76c] cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Workout Program
        </button>
      </div>

      {/* Overview KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[14px] border border-[#29312B] bg-[#151917] p-5">
          <p className="text-xs text-[#A1AAA3]">Registered Members</p>
          <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#F7F9F6]">{users.length}</p>
        </div>
        <div className="rounded-[14px] border border-[#29312B] bg-[#151917] p-5">
          <p className="text-xs text-[#A1AAA3]">Active Premium</p>
          <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#B8F34A]">{activePremiumUsers}</p>
        </div>
        <div className="rounded-[14px] border border-[#29312B] bg-[#151917] p-5">
          <p className="text-xs text-[#A1AAA3]">Verified Paystack Revenue</p>
          <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#F7F9F6]">
            ₦{totalRevenueNgn.toLocaleString('en-NG')}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#29312B] bg-[#151917] p-5">
          <p className="text-xs text-[#A1AAA3]">Completed Sessions</p>
          <p className="mt-2 font-mono-tabular text-3xl font-bold text-[#F7F9F6]">
            {totalSessionsLogged}
          </p>
        </div>
      </div>

      {/* Create Workout Form */}
      {showNewForm && (
        <form
          onSubmit={handleAddProgram}
          className="rounded-[16px] border border-[#B8F34A]/60 bg-[#151917] p-6 space-y-4"
        >
          <h2 className="font-display text-2xl font-bold text-[#F7F9F6]">Publish New Program</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="new-prog-title" className="block text-xs text-[#A1AAA3] mb-1">
                Program Title
              </label>
              <input
                id="new-prog-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Lagos Morning Kettlebell Burn"
                className="w-full h-10 px-3 rounded-[8px] border border-[#29312B] bg-[#0B0D0C] text-sm text-[#F7F9F6]"
              />
            </div>
            <div>
              <label htmlFor="new-prog-cat" className="block text-xs text-[#A1AAA3] mb-1">
                Category
              </label>
              <select
                id="new-prog-cat"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CategorySlug)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#29312B] bg-[#0B0D0C] text-sm text-[#F7F9F6]"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio &amp; HIIT</option>
                <option value="mobility">Yoga &amp; Mobility</option>
                <option value="home">Home Workouts</option>
              </select>
            </div>
            <div>
              <label htmlFor="new-prog-diff" className="block text-xs text-[#A1AAA3] mb-1">
                Difficulty
              </label>
              <select
                id="new-prog-diff"
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as DifficultyLevel)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#29312B] bg-[#0B0D0C] text-sm text-[#F7F9F6]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="new-prog-dur" className="block text-xs text-[#A1AAA3] mb-1">
                Duration (min)
              </label>
              <input
                id="new-prog-dur"
                type="number"
                min={10}
                max={90}
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-[8px] border border-[#29312B] bg-[#0B0D0C] text-sm text-[#F7F9F6] font-mono-tabular"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <label className="inline-flex items-center gap-2 text-xs text-[#F7F9F6] cursor-pointer">
              <input
                type="checkbox"
                checked={newIsPremium}
                onChange={(e) => setNewIsPremium(e.target.checked)}
                className="accent-[#B8F34A]"
              />
              Restrict to Premium members
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2 rounded-[8px] border border-[#29312B] text-xs text-[#A1AAA3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-[8px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold cursor-pointer"
              >
                Save &amp; Publish
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Segmented Admin Section Switch */}
      <div className="inline-flex items-center p-1 rounded-[10px] border border-[#29312B] bg-[#151917]">
        {(
          [
            { id: 'workouts', label: 'Workout Programs' },
            { id: 'users', label: 'Users' },
            { id: 'payments', label: 'Payments' },
            { id: 'articles', label: 'Articles' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 rounded-[7px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === item.id ? 'bg-[#B8F34A] text-[#0B0D0C]' : 'text-[#A1AAA3] hover:text-[#F7F9F6]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-[16px] border border-[#29312B] bg-[#151917] p-6">
        {tab === 'workouts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#29312B] text-xs text-[#A1AAA3]">
                  <th className="py-2.5 pr-4 font-medium">Program</th>
                  <th className="py-2.5 px-3 font-medium">Category</th>
                  <th className="py-2.5 px-3 font-medium">Difficulty</th>
                  <th className="py-2.5 px-3 font-medium text-right">Duration</th>
                  <th className="py-2.5 px-3 font-medium">Access</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29312B]/70 text-sm">
                {programs.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1D231F]/60">
                    <td className="py-3 pr-4 font-medium text-[#F7F9F6]">{p.title}</td>
                    <td className="py-3 px-3 text-xs text-[#A1AAA3]">{p.categoryLabel}</td>
                    <td className="py-3 px-3 text-xs text-[#A1AAA3]">{p.difficulty}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-xs text-[#A1AAA3]">
                      {p.durationMinutes} min
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onToggleProgramTier(p.id)}
                        className={`text-xs font-medium hover:underline cursor-pointer ${
                          p.isPremium ? 'text-[#B8F34A]' : 'text-[#A1AAA3]'
                        }`}
                      >
                        {p.isPremium ? 'Premium' : 'Free'}
                      </button>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleProgramPublish(p.id)}
                        className={`px-3 py-1 rounded-[8px] border text-xs font-medium cursor-pointer ${
                          p.isPublished
                            ? 'border-[#48C774]/40 text-[#48C774] bg-[#0B0D0C]'
                            : 'border-[#29312B] text-[#A1AAA3] bg-[#0B0D0C]'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-[#A1AAA3] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search members by name or city..."
                className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-[#29312B] bg-[#0B0D0C] text-xs text-[#F7F9F6]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#29312B] text-xs text-[#A1AAA3]">
                    <th className="py-2.5 pr-4 font-medium">Member</th>
                    <th className="py-2.5 px-3 font-medium">Location</th>
                    <th className="py-2.5 px-3 font-medium">Tier</th>
                    <th className="py-2.5 px-3 font-medium text-right">Sessions</th>
                    <th className="py-2.5 pl-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#29312B]/70 text-sm">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#1D231F]/60">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-[#F7F9F6]">{u.fullName}</p>
                        <p className="text-xs text-[#A1AAA3]">{u.email}</p>
                      </td>
                      <td className="py-3 px-3 text-xs text-[#A1AAA3]">{u.location}</td>
                      <td className="py-3 px-3 text-xs font-medium capitalize text-[#F7F9F6]">
                        {u.tier}
                      </td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-xs text-[#A1AAA3]">
                        {u.sessionsCompleted}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          type="button"
                          onClick={() => onToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-[8px] border text-xs font-medium cursor-pointer ${
                            u.status === 'active'
                              ? 'border-[#48C774]/40 text-[#48C774] bg-[#0B0D0C]'
                              : 'border-[#F05C5C]/40 text-[#F05C5C] bg-[#0B0D0C]'
                          }`}
                        >
                          {u.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#29312B] text-xs text-[#A1AAA3]">
                  <th className="py-2.5 pr-4 font-medium">Reference</th>
                  <th className="py-2.5 px-3 font-medium">Member</th>
                  <th className="py-2.5 px-3 font-medium">Plan</th>
                  <th className="py-2.5 px-3 font-medium">Channel</th>
                  <th className="py-2.5 px-3 font-medium text-right">Amount</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29312B]/70 text-sm">
                {payments.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#1D231F]/60">
                    <td className="py-3 pr-4 font-mono-tabular text-xs text-[#F7F9F6]">{tx.reference}</td>
                    <td className="py-3 px-3 text-xs text-[#A1AAA3]">{tx.memberName}</td>
                    <td className="py-3 px-3 text-xs text-[#F7F9F6]">{tx.planName}</td>
                    <td className="py-3 px-3 text-xs text-[#A1AAA3]">{tx.channel}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-xs text-[#F7F9F6]">
                      ₦{tx.amountNgn.toLocaleString('en-NG')}
                    </td>
                    <td className="py-3 pl-3 text-right text-xs font-medium">
                      <span
                        className={
                          tx.status === 'success'
                            ? 'text-[#48C774]'
                            : tx.status === 'pending'
                            ? 'text-[#B8F34A]'
                            : 'text-[#F05C5C]'
                        }
                      >
                        {tx.status === 'success' ? 'Verified' : tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'articles' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#29312B] text-xs text-[#A1AAA3]">
                  <th className="py-2.5 pr-4 font-medium">Article Title</th>
                  <th className="py-2.5 px-3 font-medium">Category</th>
                  <th className="py-2.5 px-3 font-medium">Published</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29312B]/70 text-sm">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#1D231F]/60">
                    <td className="py-3 pr-4 font-medium text-[#F7F9F6]">{art.title}</td>
                    <td className="py-3 px-3 text-xs text-[#A1AAA3]">{art.category}</td>
                    <td className="py-3 px-3 text-xs text-[#A1AAA3]">{art.publishedAt}</td>
                    <td className="py-3 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleArticleStatus(art.id)}
                        className={`px-3 py-1 rounded-[8px] border text-xs font-medium cursor-pointer ${
                          art.status === 'published'
                            ? 'border-[#48C774]/40 text-[#48C774] bg-[#0B0D0C]'
                            : 'border-[#29312B] text-[#A1AAA3] bg-[#0B0D0C]'
                        }`}
                      >
                        {art.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
