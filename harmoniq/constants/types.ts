// Missions Types & Interfaces
export type MissionType = 'training' | 'xp-earned';

export type Mission = {
  id: string;
  title: string;
  type: MissionType;
  category: string;      
  subcategory: string;   
  goal: number;
  xpReward: number;
};

export type MissionWithProgress = Mission & {
  progress: number;
};

export type MissionScope = 'daily' | 'weekly';

export interface MissionStore {
  dailyMissions: MissionWithProgress[];
  weeklyMissions: MissionWithProgress[];
  claimedMissionIds: Set<string>;

  generateDailyMissions: (count: number) => void;
  generateWeeklyMissions: (count: number) => void;
  resetAllMissions: () => void;

  incrementMissionProgress: (
    scope: MissionScope,
    missionId: string,
    amount?: number
  ) => void;

  claimMission: (missionId: string) => void;

  updateMissionsFromActivity: (
    type: 'training' | 'xp-earned',
    category: string,
    subcategory: string,
    xpGained?: number
  ) => void;
}

// Activity Types & Interfaces
export type ActivityDefinition =
  | { type: 'note-reading'; clef: 'Treble' | 'Bass'; level: number }
  | { type: 'interval'; level: number }
  | { type: 'key-signature-id'; level: number }
  | { type: 'tap-rhythm'; level: number };

export type ActivityType = 'note-reading' | 'interval' | 'key-signature-id' | 'tap-rhythm' | 'lesson';

export interface LessonChapter {
  [level: string]: ActivityDefinition[];
}

export interface LessonsData {
  [chapter: string]: LessonChapter;
}

export interface ActivityComponentProps {
  level: number;
  onSuccess: () => void;
}

export interface NoteReadingGameProps extends ActivityComponentProps {
  clefName: 'Treble' | 'Bass';
  notes: string[];
  noteImages: Record<string, any>;
}

// Data Stores
export type StatCategory = {
  total: number;
  subcategories: Record<string, number>; // e.g. { 'treble-clef': 4, 'bass-clef': 2 }
};

export type TrainingStats = {
  'note-reading': StatCategory;
  rhythm: StatCategory;
  intervals: StatCategory;
  notation: StatCategory;
};

export type TimeScopeStats = {
  trainingsCompleted: number;
  trainingStats: TrainingStats;
};

export type StatsStore = {
  lifetime: TimeScopeStats & { lessonProgress: string; longestStreak: number };
  weekly: TimeScopeStats;
  daily: TimeScopeStats;
  dailyStreak: number;
  lastActivityDate: string | null;

  lastCompletedLesson: string | null;

  updateLessonProgress: (lessonKey: string) => void;

  incrementTrainingStat: (
    category: keyof TrainingStats,
    subcategory: string
  ) => void;

  updateStreak: (currentDate: Date) => void;

  resetDaily: () => void;
  resetWeekly: () => void;
};

export type ProgressStore = {
  completedLessons: number;
  totalXP: number;

  claimXP: (amount: number) => void;
  incrementLessonProgress: () => void;
  resetProgress: () => void;
};

// XP
export type XPState = {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
  totalXP: number; // 👈 new
  justLeveledUp: boolean;
};

export type XPContextType = Omit<XPState, 'justLeveledUp'> & {
  claimXP: (amount: number) => void;
  justLeveledUp: boolean;
};

// Misc
export type CompletionScreenProps = {
  mode: 'lesson' | 'training';
  xpAwarded: number;
  onNext: () => void;
  onReplay?: () => void;
  onClaim: () => void;
  hasClaimed: boolean;
};
