export type MissionStatus = 'locked' | 'available' | 'completed';

export interface MissionDef {
  id: number;
  code: string;
  title: string;
  category: string;
  description: string;
  instruction: string;
  bnccSkill: string;
  cognitiveFocus: string[];
}

export interface MissionProgress {
  missionId: number;
  completed: boolean;
  highScore: number;
  stars: number; // 0 to 3
  attempts: number;
}

export interface GameProgress {
  unlockedMissionId: number; // 1 to 15
  totalScore: number;
  missions: Record<number, MissionProgress>;
  streak: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extralarge';
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export type ScreenState = 
  | 'title'
  | 'central'
  | 'playing'
  | 'final_victory';

export interface FeedbackState {
  type: 'correct' | 'incorrect' | null;
  message: string;
}
