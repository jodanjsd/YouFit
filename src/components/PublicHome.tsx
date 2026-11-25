import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Dumbbell,
  Lock,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AppView, Article, CategorySlug, WorkoutProgram } from '../types/fitpro';
import { FITPRO_IMAGES, TESTIMONIALS } from '../data/fitproSeed';
import { ImageWithFallback } from './ImageWithFallback';

interface PublicHomeProps {
  programs: WorkoutProgram[];
  articles: Article[];
  isPremiumMember: boolean;
  onNavigate: (view: AppView) => void;
  onSelectCategory: (category: CategorySlug) => void;
  onSelectProgram: (program: WorkoutProgram) => void;
  onOpenOnboarding: () => void;
}

const CATEGORIES: {
  slug: CategorySlug;
  title: string;
  subtitle: string;
  image: string;
}[] = [
  {
    slug: 'strength',
    title: 'Strength Training',
    subtitle: 'Barbell, kettlebell, and progressive resistance splits.',
    image: FITPRO_IMAGES.strength,
  },
  {
    slug: 'cardio',
    title: 'Cardio & Conditioning',
    subtitle: 'Battle ropes, intervals, and metabolic endurance blocks.',
    image: FITPRO_IMAGES.cardio,
  },
  {
    slug: 'mobility',
    title: 'Yoga & Flexibility',
    subtitle: 'Thoracic rotation, hip decompression, and recovery flows.',
    image: FITPRO_IMAGES.mobility,
  },
  {
    slug: 'home',
    title: 'Home Workouts',
    subtitle: 'Equipment-light circuits tailored for busy schedules.',
    image: FITPRO_IMAGES.home,
  },
];

export const PublicHome: React.FC<PublicHomeProps> = ({
  programs,
  articles,
  isPremiumMember,
  onNavigate,
  onSelectCategory,
  onSelectProgram,
  onOpenOnboarding,
}) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const publishedPrograms = programs.filter((p) => p.isPublished);
  const featuredPrograms = publishedPrograms.slice(0, 3);
  const publishedArticles = articles.filter((a) => a.status === 'published');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setNewsletterError('Enter a valid email address to subscribe.');
      return;
    }
    setNewsletterError('');
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
  };

  return (
    <div className="w-full">
      {/* 1. Architectural Full-Bleed Hero Banner */}
      <section className="relative border-b border-[#232A26] bg-[#0B0D0C]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pt-8 lg:pb-16">
          <div className="relative overflow-hidden rounded-[20px] border border-[#232A26] bg-[#121614] min-h-[500px] lg:min-h-[580px] flex items-end">
            <ImageWithFallback
              src={FITPRO_IMAGES.hero}
              alt="Athletes training with kettlebells in a dark architectural gym"
              className="absolute inset-0 w-full h-full object-cover object-center"
              fallbackTitle="FitPro Training Studio"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0B0D0C]/95 via-[#0B0D0C]/75 to-[#0B0D0C]/20"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0B0D0C] via-transparent to-transparent"
              aria-hidden="true"
            />

            <div className="relative z-10 w-full p-6 sm:p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 max-w-2xl">
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#B8F34A] mb-3">
                  Structured Training · Nigeria &amp; Global Access
                </p>
                <h1 className="font-display text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#F7F9F6] leading-[0.98] text-balance">
                  Your fitness. Your rules. Your stronger future.
                </h1>
                <p className="mt-5 text-base sm:text-lg text-[#B5BEB7] max-w-xl leading-relaxed">
                  Train smarter with progressive strength and conditioning programs, an interactive exercise player with built-in rest timers, and measurable weekly progress tracking.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onOpenOnboarding}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] font-semibold text-sm hover:bg-[#c8f76c] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Start Training
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('workouts')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] border border-[#2F3933] bg-[#151917]/90 text-[#F7F9F6] font-medium text-sm hover:border-[#B8F34A]/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Explore Workouts
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 hidden lg:block">
                <div className="rounded-[14px] border border-[#29312B] bg-[#0B0D0C]/85 backdrop-blur-md p-5">
                  <p className="text-xs text-[#A1AAA3]">Next Free Session Ready</p>
                  <p className="mt-1 font-display text-xl font-bold text-[#F7F9F6]">
                    Full Body Strength Foundation
                  </p>
                  <p className="mt-1 text-xs text-[#A1AAA3] tabular-nums">
                    35 min · Intermediate · 4 compound exercises
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const starter = publishedPrograms[0];
                      if (starter) onSelectProgram(starter);
                    }}
                    className="mt-4 w-full py-2.5 rounded-[8px] border border-[#2F3933] bg-[#151917] text-xs font-semibold text-[#F7F9F6] hover:border-[#B8F34A] hover:text-[#B8F34A] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#B8F34A]" />
                    Launch Workout Player
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4-column benchmark strip directly below hero */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#232A26] rounded-[16px] border border-[#232A26] bg-[#121614]">
            <div className="p-6">
              <p className="font-mono-tabular text-2xl font-semibold text-[#F7F9F6]">60+</p>
              <p className="mt-1 text-sm font-semibold text-[#F7F9F6]">Guided Exercises</p>
              <p className="mt-1 text-xs text-[#A1AAA3] leading-relaxed">
                Clear execution cues, common mistake checks, and joint safety notes.
              </p>
            </div>
            <div className="p-6">
              <p className="font-mono-tabular text-2xl font-semibold text-[#F7F9F6]">20</p>
              <p className="mt-1 text-sm font-semibold text-[#F7F9F6]">Structured Programs</p>
              <p className="mt-1 text-xs text-[#A1AAA3] leading-relaxed">
                Built for apartment floors, dumbbell setups, or full gym racks.
              </p>
            </div>
            <div className="p-6">
              <p className="font-mono-tabular text-2xl font-semibold text-[#F7F9F6]">01:15</p>
              <p className="mt-1 text-sm font-semibold text-[#F7F9F6]">Built-In Rest Timers</p>
              <p className="mt-1 text-xs text-[#A1AAA3] leading-relaxed">
                Automatic rest countdowns and set logging inside one screen.
              </p>
            </div>
            <div className="p-6">
              <p className="font-mono-tabular text-2xl font-semibold text-[#F7F9F6]">₦5,000</p>
              <p className="mt-1 text-sm font-semibold text-[#F7F9F6]">Monthly Premium</p>
              <p className="mt-1 text-xs text-[#A1AAA3] leading-relaxed">
                Paystack card, bank transfer, and USSD checkout with instant access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Programs — Asymmetric Bento */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F9F6]">
              Featured Workout Programs
            </h2>
            <p className="mt-1 text-sm text-[#A1AAA3]">
              Pick a program matched to your equipment and launch directly into the workout player.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('workouts')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8F34A] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            View all programs
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {featuredPrograms.map((program, idx) => {
            const isHeroCard = idx === 0;
            const locked = program.isPremium && !isPremiumMember;
            return (
              <article
                key={program.id}
                className={`group rounded-[16px] border border-[#232A26] bg-[#151917] overflow-hidden flex flex-col justify-between transition-colors hover:border-[#3A463F] ${
                  isHeroCard ? 'lg:col-span-6' : 'lg:col-span-3'
                }`}
              >
                <div>
                  <div className={`relative overflow-hidden ${isHeroCard ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                    <ImageWithFallback
                      src={program.thumbnailUrl}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      fallbackTitle={program.title}
                    />
                  </div>
                  <div className="p-6">
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

                    <h3 className="mt-2 font-display text-2xl font-bold text-[#F7F9F6] leading-tight">
                      {program.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#A1AAA3] line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-[#232A26]">
                  <span className="text-xs text-[#A1AAA3] tabular-nums truncate pr-2">
                    {program.exercises.length} exercises · {program.equipment}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectProgram(program)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8F34A] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {locked ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {locked ? 'Preview' : 'Start'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. Core Training Disciplines */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#232A26]">
        <div className="mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F9F6]">
            Training Disciplines
          </h2>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Filter the library by training focus, equipment availability, or intensity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className="group text-left rounded-[16px] border border-[#232A26] bg-[#151917] overflow-hidden hover:border-[#B8F34A]/60 transition-colors cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  fallbackTitle={cat.title}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-[#F7F9F6]">{cat.title}</h3>
                  <ArrowRight className="w-4 h-4 text-[#A1AAA3] group-hover:text-[#B8F34A] transition-colors shrink-0" />
                </div>
                <p className="mt-1.5 text-sm text-[#A1AAA3] leading-relaxed">{cat.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Mechanism + Attributable Member Proof */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#232A26]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F9F6]">
                Built for Consistency
              </h2>
              <p className="mt-2 text-sm text-[#A1AAA3] leading-relaxed">
                Every workflow removes friction between opening the platform and completing your working sets.
              </p>
            </div>

            <div className="space-y-5 divide-y divide-[#232A26]">
              <div className="pt-4 first:pt-0">
                <h3 className="text-base font-semibold text-[#F7F9F6]">
                  01. Goal &amp; Equipment Calibration
                </h3>
                <p className="mt-1 text-sm text-[#A1AAA3] leading-relaxed">
                  Set your training goal, weekly frequency, and gym or home setup in 60 seconds to surface matching programs immediately.
                </p>
              </div>
              <div className="pt-5">
                <h3 className="text-base font-semibold text-[#F7F9F6]">
                  02. Single-Screen Workout Player
                </h3>
                <p className="mt-1 text-sm text-[#A1AAA3] leading-relaxed">
                  Follow exercise cues, log actual sets and reps, and run automatic rest countdowns without leaving the session screen.
                </p>
              </div>
              <div className="pt-5">
                <h3 className="text-base font-semibold text-[#F7F9F6]">
                  03. Verified Progress Ledger
                </h3>
                <p className="mt-1 text-sm text-[#A1AAA3] leading-relaxed">
                  Every finished session updates your weekly training minutes, active target percentage, and completed history.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.name}
                className="rounded-[16px] border border-[#232A26] bg-[#151917] p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-[#B8F34A] tabular-nums">{item.outcome}</p>
                  <p className="mt-3 text-sm text-[#F7F9F6] leading-relaxed">“{item.quote}”</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#232A26]">
                  <p className="text-sm font-semibold text-[#F7F9F6]">{item.name}</p>
                  <p className="text-xs text-[#A1AAA3]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Membership Pricing Preview */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#232A26]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F9F6]">
              Simple Membership Pricing
            </h2>
            <p className="mt-1 text-sm text-[#A1AAA3]">
              Start free with foundational routines or unlock the complete library via Paystack.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('pricing')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8F34A] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            Compare all plans
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[16px] border border-[#232A26] bg-[#151917] p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#F7F9F6]">Free Starter</h3>
                  <p className="text-xs text-[#A1AAA3] mt-0.5">For beginners &amp; home habit builders</p>
                </div>
                <p className="font-mono-tabular text-3xl font-bold text-[#F7F9F6]">₦0</p>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-[#A1AAA3]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#48C774] shrink-0" />
                  3 foundational strength, home, and mobility programs
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#48C774] shrink-0" />
                  Full workout player with built-in rest countdowns
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#48C774] shrink-0" />
                  Weekly session count and active minutes log
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="mt-7 w-full py-3 rounded-[10px] border border-[#2F3933] text-sm font-semibold text-[#F7F9F6] hover:border-[#B8F34A] transition-colors cursor-pointer"
            >
              Start Free Account
            </button>
          </div>

          <div className="rounded-[16px] border border-[#B8F34A]/70 bg-[#151917] p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#F7F9F6]">FitPro Premium</h3>
                  <p className="text-xs text-[#A1AAA3] mt-0.5">Monthly, quarterly, or annual NGN billing</p>
                </div>
                <div className="text-right">
                  <p className="font-mono-tabular text-3xl font-bold text-[#B8F34A]">₦5,000</p>
                  <p className="text-[11px] text-[#A1AAA3]">per month</p>
                </div>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-[#F7F9F6]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#B8F34A] shrink-0" />
                  All 20+ strength, HIIT conditioning, and hypertrophy splits
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#B8F34A] shrink-0" />
                  Unlimited saved programs and full form-cue demonstrations
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#B8F34A] shrink-0" />
                  Verified Paystack card, bank transfer, and USSD checkout
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="mt-7 w-full py-3 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] transition-colors cursor-pointer"
            >
              View Premium Plans
            </button>
          </div>
        </div>
      </section>

      {/* 6. Nutrition & Training Articles */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#232A26]">
        <div className="mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F9F6]">
            Nutrition &amp; Training Guides
          </h2>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Practical programming and meal guidance written for everyday schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedArticles.map((article) => (
            <article
              key={article.id}
              className="rounded-[16px] border border-[#232A26] bg-[#151917] overflow-hidden flex flex-col justify-between hover:border-[#3A463F] transition-colors"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    fallbackTitle={article.title}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#A1AAA3]">
                    <span className="text-[#F7F9F6]">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{article.readTimeMinutes} min read</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold text-[#F7F9F6] leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#A1AAA3] leading-relaxed">{article.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setActiveArticle(article)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8F34A] hover:underline cursor-pointer"
                >
                  Read article
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Multi-Column Enterprise Footer + Newsletter */}
      <footer className="border-t border-[#232A26] bg-[#0B0D0C]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-[#232A26]">
            <div className="lg:col-span-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F7F9F6]">
                Weekly Training Notes
              </h2>
              <p className="mt-1 text-sm text-[#A1AAA3]">
                New workout drops, mobility routines, and practical nutrition guides—sent once a week.
              </p>
            </div>
            <div className="lg:col-span-6">
              {newsletterSubmitted ? (
                <div className="flex items-center gap-2.5 rounded-[12px] border border-[#48C774]/40 bg-[#151917] px-4 py-3 text-sm text-[#48C774]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed. Look out for Monday&apos;s FitPro training brief.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterError) setNewsletterError('');
                      }}
                      placeholder="you@example.com"
                      className="w-full h-12 px-4 rounded-[10px] border border-[#232A26] bg-[#151917] text-sm text-[#F7F9F6] placeholder:text-[#A1AAA3]/60 focus:border-[#B8F34A] focus:outline-none"
                    />
                    {newsletterError && (
                      <p className="mt-1.5 text-xs text-[#F05C5C]">{newsletterError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 border-b border-[#232A26] text-sm">
            <div className="lg:col-span-5">
              <span className="font-display text-2xl font-extrabold text-[#F7F9F6]">FitPro</span>
              <p className="mt-2 text-xs text-[#A1AAA3] max-w-sm leading-relaxed">
                Web-first fitness and workout platform built for Nigeria and global members. Educational training programs, not medical diagnosis or treatment.
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#A1AAA3]">
                <ShieldCheck className="w-4 h-4 text-[#48C774]" />
                Aligned with Nigeria Data Protection Act (NDPA) privacy principles
              </p>
            </div>

            <div className="lg:col-span-2 space-y-2.5 text-xs">
              <p className="font-semibold text-[#F7F9F6]">Training</p>
              <button
                type="button"
                onClick={() => onNavigate('workouts')}
                className="block text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
              >
                Workout Programs
              </button>
              <button
                type="button"
                onClick={() => onNavigate('exercises')}
                className="block text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
              >
                Exercise Library
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory('home')}
                className="block text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
              >
                Home Workouts
              </button>
            </div>

            <div className="lg:col-span-2 space-y-2.5 text-xs">
              <p className="font-semibold text-[#F7F9F6]">Platform</p>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="block text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
              >
                Member Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate('pricing')}
                className="block text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
              >
                Membership &amp; Pricing
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="block text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
              >
                Admin Console
              </button>
            </div>

            <div className="lg:col-span-3 space-y-2 text-xs text-[#A1AAA3]">
              <p className="font-semibold text-[#F7F9F6]">Safety Notice</p>
              <p className="leading-relaxed">
                Stop exercising immediately if you experience sharp pain, dizziness, or unusual discomfort. Consult a qualified professional before beginning intense physical activity.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A1AAA3]">
            <span>© 2026 FitPro. All rights reserved.</span>
            <span>Paystack NGN Billing · Responsive Web Platform</span>
          </div>
        </div>
      </footer>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-title"
        >
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[18px] border border-[#29312B] bg-[#151917] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#A1AAA3]">
                <span className="text-[#B8F34A] font-medium">{activeArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  {activeArticle.readTimeMinutes} min read
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="w-9 h-9 rounded-[10px] border border-[#29312B] flex items-center justify-center text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer shrink-0"
                aria-label="Close article"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3
              id="article-modal-title"
              className="mt-3 font-display text-3xl font-bold text-[#F7F9F6] leading-tight"
            >
              {activeArticle.title}
            </h3>

            <div className="mt-5 aspect-[16/9] overflow-hidden rounded-[12px] border border-[#29312B]">
              <ImageWithFallback
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                fallbackTitle={activeArticle.title}
              />
            </div>

            <div className="mt-6 space-y-4 text-sm sm:text-base text-[#A1AAA3] leading-relaxed">
              {activeArticle.content.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            <div className="mt-8 pt-5 border-t border-[#29312B] flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-xs text-[#A1AAA3]">
                <Dumbbell className="w-4 h-4 text-[#B8F34A]" />
                Pair this guide with a structured FitPro program
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  onNavigate('workouts');
                }}
                className="px-4 py-2 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] cursor-pointer"
              >
                Browse Workouts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
