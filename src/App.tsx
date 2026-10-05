import React, { useState, useEffect } from 'react';
import { MISSIONS } from './data/missions';
import {
  ScreenState,
  GameProgress,
  AccessibilitySettings,
  FeedbackState,
} from './types/game';
import { sounds } from './utils/audio';

// Top Bar & Common Views
import { TopBar } from './components/TopBar';
import { TitleScreen } from './components/TitleScreen';
import { MissionCentral } from './components/MissionCentral';
import { MissionContainer } from './components/MissionContainer';
import { FinalVictoryScreen } from './components/FinalVictoryScreen';

// Modals
import { HowToPlayModal } from './components/HowToPlayModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { MissionSuccessModal } from './components/MissionSuccessModal';
import { GameOverModal } from './components/GameOverModal';

// Phase Components
import { Phase1MemoryCards } from './components/phases/Phase1MemoryCards';
import { Phase2SecretCode } from './components/phases/Phase2SecretCode';
import { Phase3DetectiveDetails } from './components/phases/Phase3DetectiveDetails';
import { Phase4TotalAttention } from './components/phases/Phase4TotalAttention';
import { Phase5DontClick } from './components/phases/Phase5DontClick';
import { Phase6LostSequence } from './components/phases/Phase6LostSequence';
import { Phase7VisualMemory } from './components/phases/Phase7VisualMemory';
import { Phase8PatternHunt } from './components/phases/Phase8PatternHunt';
import { Phase9DualInstruction } from './components/phases/Phase9DualInstruction';
import { Phase10WorkingMemory } from './components/phases/Phase10WorkingMemory';
import { Phase11CodeDetective } from './components/phases/Phase11CodeDetective';
import { Phase12AttentionPath } from './components/phases/Phase12AttentionPath';
import { Phase13TimeAttack } from './components/phases/Phase13TimeAttack';
import { Phase14SuperConcentration } from './components/phases/Phase14SuperConcentration';
import { Phase15FinalChallenge } from './components/phases/Phase15FinalChallenge';

const STORAGE_KEY_PROGRESS = 'operacao_foco_progress_v1';
const STORAGE_KEY_A11Y = 'operacao_foco_a11y_v1';

const INITIAL_PROGRESS: GameProgress = {
  unlockedMissionId: 1,
  totalScore: 0,
  streak: 0,
  missions: {},
};

const INITIAL_A11Y: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  reducedMotion: false,
  soundEnabled: true,
};

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('title');
  const [activeMissionId, setActiveMissionId] = useState<number>(1);
  const [phaseKey, setPhaseKey] = useState<number>(1); // used to force clean re-mount of current phase

  // Game Run State
  const [lives, setLives] = useState<number>(3);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '' });
  const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);

  // Modals state
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);

  // Success summary details
  const [lastStars, setLastStars] = useState(3);
  const [lastScoreGained, setLastScoreGained] = useState(100);
  const [lastSpeedBonus, setLastSpeedBonus] = useState(0);
  const [lastStreakBonus, setLastStreakBonus] = useState(0);

  // Persistence
  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PROGRESS;
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_A11Y);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_A11Y;
  });

  // Keep audio system synchronized
  useEffect(() => {
    sounds.setSoundEnabled(accessibility.soundEnabled);
  }, [accessibility.soundEnabled]);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch {
      // ignore storage full
    }
  }, [progress]);

  // Persist accessibility
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_A11Y, JSON.stringify(accessibility));
    } catch {
      // ignore
    }
  }, [accessibility]);

  // Helper to show momentary feedback banner
  const triggerFeedback = (type: 'correct' | 'incorrect', message: string) => {
    if (feedbackTimeout) clearTimeout(feedbackTimeout);
    setFeedback({ type, message });
    const timer = setTimeout(() => {
      setFeedback({ type: null, message: '' });
    }, 3000);
    setFeedbackTimeout(timer);
  };

  // Launch a mission
  const handleStartMission = (missionId: number) => {
    setActiveMissionId(missionId);
    setLives(3);
    setFeedback({ type: null, message: '' });
    setIsSuccessModalOpen(false);
    setIsGameOverOpen(false);
    setPhaseKey((k) => k + 1);
    setScreen('playing');
  };

  // Retry the current active mission
  const handleRetryActiveMission = () => {
    sounds.playClick();
    setLives(3);
    setFeedback({ type: null, message: '' });
    setIsGameOverOpen(false);
    setIsSuccessModalOpen(false);
    setPhaseKey((k) => k + 1);
  };

  // Correct answer handler from a phase
  const handlePhaseSuccess = (stars: number, speedBonus: number, basePoints: number) => {
    sounds.playVictory();

    const streakBonus = progress.streak > 1 ? 25 : 0;
    const totalGained = basePoints + speedBonus + streakBonus;

    setLastStars(stars);
    setLastScoreGained(basePoints);
    setLastSpeedBonus(speedBonus);
    setLastStreakBonus(streakBonus);

    triggerFeedback('correct', 'Excelente! Você manteve o foco!');

    // Update progress state
    setProgress((prev) => {
      const currentMissionData = prev.missions[activeMissionId] || {
        missionId: activeMissionId,
        completed: false,
        highScore: 0,
        stars: 0,
        attempts: 0,
      };

      const newHighScore = Math.max(currentMissionData.highScore, totalGained);
      const newStars = Math.max(currentMissionData.stars, stars);
      const nextUnlocked = Math.max(prev.unlockedMissionId, Math.min(15, activeMissionId + 1));

      return {
        ...prev,
        unlockedMissionId: nextUnlocked,
        totalScore: prev.totalScore + totalGained,
        streak: prev.streak + 1,
        missions: {
          ...prev.missions,
          [activeMissionId]: {
            missionId: activeMissionId,
            completed: true,
            highScore: newHighScore,
            stars: newStars,
            attempts: currentMissionData.attempts + 1,
          },
        },
      };
    });

    setIsSuccessModalOpen(true);
  };

  // Error handler from a phase
  const handlePhaseError = (penalty: number, message: string) => {
    triggerFeedback('incorrect', message || 'Observe novamente. Analise todos os elementos antes de responder.');

    // Deduct life
    setLives((prevLives) => {
      const nextLives = prevLives - 1;
      if (nextLives <= 0) {
        // Lost all 3 lives
        setIsGameOverOpen(true);
        return 0;
      }
      return nextLives;
    });

    // Score penalty (-20 points, non-negative total)
    setProgress((prev) => ({
      ...prev,
      totalScore: Math.max(0, prev.totalScore - penalty),
      streak: 0, // reset streak
    }));
  };

  // Reset all progress (with confirmation already prompted in UI)
  const handleResetProgress = () => {
    sounds.playClick();
    setProgress(INITIAL_PROGRESS);
    setActiveMissionId(1);
    setScreen('central');
  };

  // Current active mission definition
  const currentMissionDef = MISSIONS.find((m) => m.id === activeMissionId) || MISSIONS[0];

  // Font scale class
  const fontScaleClass = {
    normal: 'text-base',
    large: 'text-lg',
    extralarge: 'text-xl',
  }[accessibility.fontSize];

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors ${fontScaleClass} ${
        accessibility.highContrast ? 'high-contrast' : ''
      } ${accessibility.reducedMotion ? 'reduced-motion' : ''}`}
    >
      {/* Universal Top Bar adhering to Top Bar Contract */}
      <TopBar
        currentScreen={screen}
        activeMissionId={activeMissionId}
        missionTitle={currentMissionDef.title}
        totalScore={progress.totalScore}
        unlockedCount={Object.values(progress.missions).filter((m) => m.completed).length}
        accessibility={accessibility}
        onToggleSound={() =>
          setAccessibility((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onNavigateToCentral={() => setScreen('central')}
        onNavigateToTitle={() => setScreen('title')}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full relative">
        {screen === 'title' && (
          <TitleScreen
            onStartGame={() => {
              sounds.playClick();
              setScreen('central');
            }}
            onOpenHowToPlay={() => {
              sounds.playClick();
              setIsHowToPlayOpen(true);
            }}
            onOpenAccessibility={() => {
              sounds.playClick();
              setIsAccessibilityOpen(true);
            }}
            hasExistingProgress={progress.unlockedMissionId > 1 || progress.totalScore > 0}
            unlockedMissionNumber={progress.unlockedMissionId}
            totalScore={progress.totalScore}
          />
        )}

        {screen === 'central' && (
          <MissionCentral
            progress={progress}
            onSelectMission={(id) => handleStartMission(id)}
            onResetProgress={handleResetProgress}
            onViewFinalVictory={() => setScreen('final_victory')}
          />
        )}

        {screen === 'playing' && (
          <MissionContainer
            mission={currentMissionDef}
            lives={lives}
            score={progress.totalScore}
            streak={progress.streak}
            feedback={feedback}
            onRetry={handleRetryActiveMission}
          >
            {/* Render current phase component */}
            <div key={phaseKey} className="w-full">
              {activeMissionId === 1 && (
                <Phase1MemoryCards onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 2 && (
                <Phase2SecretCode onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 3 && (
                <Phase3DetectiveDetails onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 4 && (
                <Phase4TotalAttention onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 5 && (
                <Phase5DontClick onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 6 && (
                <Phase6LostSequence onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 7 && (
                <Phase7VisualMemory onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 8 && (
                <Phase8PatternHunt onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 9 && (
                <Phase9DualInstruction onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 10 && (
                <Phase10WorkingMemory onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 11 && (
                <Phase11CodeDetective onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 12 && (
                <Phase12AttentionPath onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 13 && (
                <Phase13TimeAttack onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 14 && (
                <Phase14SuperConcentration onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
              {activeMissionId === 15 && (
                <Phase15FinalChallenge onSuccess={handlePhaseSuccess} onError={handlePhaseError} />
              )}
            </div>
          </MissionContainer>
        )}

        {screen === 'final_victory' && (
          <FinalVictoryScreen
            progress={progress}
            onPlayAgain={() => {
              sounds.playClick();
              handleResetProgress();
              handleStartMission(1);
            }}
            onGoToMenu={() => {
              sounds.playClick();
              setScreen('title');
            }}
            onGoToCentral={() => {
              sounds.playClick();
              setScreen('central');
            }}
          />
        )}
      </main>

      {/* MODALS */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        settings={accessibility}
        onUpdateSettings={(newSettings) =>
          setAccessibility((prev) => ({ ...prev, ...newSettings }))
        }
        onClose={() => setIsAccessibilityOpen(false)}
      />

      <MissionSuccessModal
        isOpen={isSuccessModalOpen}
        missionNumber={activeMissionId}
        missionTitle={currentMissionDef.title}
        earnedStars={lastStars}
        scoreGained={lastScoreGained}
        streakBonus={lastStreakBonus}
        speedBonus={lastSpeedBonus}
        hasNextMission={activeMissionId < 15}
        onNextMission={() => {
          sounds.playClick();
          setIsSuccessModalOpen(false);
          handleStartMission(activeMissionId + 1);
        }}
        onRetryMission={() => {
          setIsSuccessModalOpen(false);
          handleRetryActiveMission();
        }}
        onReturnToCentral={() => {
          sounds.playClick();
          setIsSuccessModalOpen(false);
          if (activeMissionId === 15) {
            setScreen('final_victory');
          } else {
            setScreen('central');
          }
        }}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        onRetry={() => {
          sounds.playClick();
          handleRetryActiveMission();
        }}
        onReturnToCentral={() => {
          sounds.playClick();
          setIsGameOverOpen(false);
          setScreen('central');
        }}
        hint={currentMissionDef.instruction}
      />
    </div>
  );
}
