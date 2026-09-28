export type RegionalLanguage = 'Tamil' | 'Kannada' | 'Telugu' | 'Hindi' | 'Marathi' | 'Bengali' | 'Malayalam';

export type RegionalTheme = 'parchment' | 'jaipur' | 'kolkata';

export type ArrivalStageId = 'day1' | 'week1' | 'month1' | 'explorer';

export interface UserProfile {
  name: string;
  homeLanguage: string;
  destinationCity: 'Chennai' | 'Jaipur' | 'Kolkata' | string;
  targetLanguage: RegionalLanguage;
  livingSituation: 'Hostel' | 'PG / Flat' | 'College Campus' | 'Day Scholar';
  interests: string[];
  proficiency: 'Complete Beginner' | 'Know a few words' | 'Intermediate';
  completedOnboarding: boolean;
  theme?: RegionalTheme;
  currentArrivalStage?: ArrivalStageId;
}

export type ScenarioCategory =
  | 'food'
  | 'transport'
  | 'college'
  | 'landlord'
  | 'shopping'
  | 'introductions'
  | 'emergency';

export interface Scenario {
  id: ScenarioCategory;
  title: string;
  personaName: string;
  personaRole: string;
  iconName: string;
  badge: string;
  description: string;
  starterPrompt: string;
  locationContext: string;
  difficulty: 'Beginner' | 'Elementary';
  initialPersonaMessage: {
    script: string;
    romanized: string;
    meaning: string;
    contextTip: string;
  };
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'model';
  senderName: string;
  script: string;
  romanized: string;
  meaning: string;
  contextTip?: string;
  correctionNote?: string;
  helpPhrase?: {
    script: string;
    romanized: string;
    meaning: string;
    pronunciationGuide: string;
  };
  suggestedResponses?: Array<{
    script: string;
    romanized: string;
    meaning: string;
    tip?: string;
  }>;
  timestamp: number;
}

export interface SavedPhrase {
  id: string;
  sourceText: string;
  targetScript: string;
  romanized: string;
  meaning: string;
  category: ScenarioCategory | 'general';
  difficulty: 'Beginner' | 'Intermediate';
  pronunciationGuide?: string;
  savedAt: number;
  timesPracticed: number;
  lastScore?: number;
}

export interface PronunciationEvaluation {
  score: number;
  verdict: string;
  feedback: string;
  breakdown: Array<{
    word: string;
    status: 'perfect' | 'good' | 'needs_work';
    tip: string;
  }>;
  practiceTip: string;
}

export interface ScanResult {
  title: string;
  detectedScript: string;
  summary: string;
  englishTranslation: string;
  items: Array<{
    localText: string;
    romanized: string;
    englishName: string;
    description: string;
    priceOrDetail?: string;
  }>;
  practicalPhrases: Array<{
    localText: string;
    romanized: string;
    meaning: string;
    usageTip?: string;
  }>;
  studentTip: string;
}

export interface WeakAreaItem {
  id: string;
  phrase: string;
  romanized: string;
  meaning: string;
  category: ScenarioCategory;
  errorCount: number;
  lastPracticed: number;
  tip: string;
}

export interface PracticeSessionRecord {
  id: string;
  timestamp: number;
  scenario: string;
  phrasesPracticed: number;
  averageScore: number;
}
