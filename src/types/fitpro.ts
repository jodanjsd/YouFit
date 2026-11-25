export type AppView =
  | 'home'
  | 'workouts'
  | 'exercises'
  | 'dashboard'
  | 'player'
  | 'pricing'
  | 'admin';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CategorySlug = 'strength' | 'cardio' | 'mobility' | 'home';

export type FitnessGoal =
  | 'Build muscle'
  | 'Lose weight'
  | 'Improve strength'
  | 'Improve endurance'
  | 'Improve flexibility'
  | 'General fitness';

export type WorkoutLocation = 'Gym' | 'Home' | 'Hybrid';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Core' | 'Full Body';
  equipment: 'Barbell' | 'Kettlebell' | 'Dumbbells' | 'Battle Ropes' | 'Bodyweight' | 'Mat';
  difficulty: DifficultyLevel;
  description: string;
  instructions: string[];
  commonMistakes: string[];
  safetyNotes: string;
  imageUrl: string;
}

export interface ProgramExerciseItem {
  exerciseId: string;
  sequence: number;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number;
}

export interface WorkoutProgram {
  id: string;
  slug: string;
  title: string;
  category: CategorySlug;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  equipment: string;
  targetMuscles: string;
  description: string;
  safetyNote: string;
  thumbnailUrl: string;
  isPremium: boolean;
  isPublished: boolean;
  exercises: ProgramExerciseItem[];
}

export interface MemberProfile {
  fullName: string;
  email: string;
  goal: FitnessGoal;
  experienceLevel: DifficultyLevel;
  workoutLocation: WorkoutLocation;
  workoutsPerWeek: number;
  preferredDuration: number;
  membershipTier: 'free' | 'premium';
  planName: string;
  renewalDate: string | null;
  onboarded: boolean;
}

export interface WorkoutSessionRecord {
  id: string;
  programId: string;
  programTitle: string;
  categoryLabel: string;
  completedAt: string;
  durationMinutes: number;
  exercisesCompleted: number;
  totalExercises: number;
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTimeMinutes: number;
  publishedAt: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  status: 'published' | 'draft';
}

export interface SubscriptionPlan {
  id: string;
  slug: 'free' | 'monthly' | 'quarterly' | 'annual';
  name: string;
  audienceLabel: string;
  priceNgn: number;
  billingLabel: string;
  savingsNote?: string;
  limits: {
    programs: string;
    exercises: string;
    analytics: string;
    savedLimit: string;
  };
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  memberName: string;
  memberEmail: string;
  planName: string;
  amountNgn: number;
  channel: 'Card' | 'Bank Transfer' | 'USSD';
  status: 'success' | 'pending' | 'failed';
  paidAt: string;
}

export interface AdminUserRecord {
  id: string;
  fullName: string;
  email: string;
  location: string;
  tier: 'free' | 'premium';
  status: 'active' | 'suspended';
  sessionsCompleted: number;
  joinedAt: string;
}
