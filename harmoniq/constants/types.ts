export type MissionType = 'daily' | 'weekly';

export type Mission = {
  id: string;
  title: string;
  type: MissionType;
  completed: boolean;
  xpReward: number;
  progress: { current: number; goal: number };
};

export type ActivityDefinition =
  | { type: 'note-reading'; clef: 'Treble' | 'Bass'; level: number }
  | { type: 'interval'; level: number }
  | { type: 'key-signature-id'; level: number }
  | { type: 'tap-rhythm'; level: number };

export type ActivityType = 'note-reading' | 'interval' | 'key-signature-id' | 'tap-rhythm' | 'lesson';

// Props to pass to each game component
export interface ActivityComponentProps {
  level: number;
  onSuccess: () => void;
}

export interface NoteReadingGameProps extends ActivityComponentProps {
  clefName: 'Treble' | 'Bass';
  notes: string[];
  noteImages: Record<string, any>;
}

