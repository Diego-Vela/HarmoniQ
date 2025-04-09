export type MissionType = 'daily' | 'weekly';

export type Mission = {
  id: string;
  title: string;
  type: MissionType;
  completed: boolean;
  xpReward: number;
  progress: { current: number; goal: number };
};
