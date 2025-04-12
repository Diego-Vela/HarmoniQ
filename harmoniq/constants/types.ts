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

// Misc
export type CompletionScreenProps = {
  mode: 'lesson' | 'training';
  xpAwarded: number;
  onNext: () => void;
  onReplay?: () => void;
};

