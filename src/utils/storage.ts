import { UserProfile, SavedPhrase, WeakAreaItem, PracticeSessionRecord } from '../types';
import { INITIAL_SAVED_PHRASES, INITIAL_WEAK_AREAS } from '../data/mockData';

const PROFILE_KEY = 'bhashabuddy_profile';
const PHRASES_KEY = 'bhashabuddy_phrases';
const WEAK_AREAS_KEY = 'bhashabuddy_weak_areas';
const SESSIONS_KEY = 'bhashabuddy_practice_sessions';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Aarav Sharma',
  homeLanguage: 'Hindi / English',
  destinationCity: 'Chennai',
  targetLanguage: 'Tamil',
  livingSituation: 'Hostel',
  interests: ['College Campus', 'Food & Mess', 'Auto & Travel'],
  proficiency: 'Complete Beginner',
  completedOnboarding: false,
  theme: 'parchment',
  currentArrivalStage: 'day1',
};

export const getStoredProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER_PROFILE;
  }
};

export const saveStoredProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
};

export const getStoredPhrases = (): SavedPhrase[] => {
  try {
    const raw = localStorage.getItem(PHRASES_KEY);
    if (!raw) {
      saveStoredPhrases(INITIAL_SAVED_PHRASES);
      return INITIAL_SAVED_PHRASES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAVED_PHRASES;
  }
};

export const saveStoredPhrases = (phrases: SavedPhrase[]): void => {
  try {
    localStorage.setItem(PHRASES_KEY, JSON.stringify(phrases));
  } catch (e) {
    console.error('Failed to save phrases:', e);
  }
};

export const addSavedPhrase = (phrase: Omit<SavedPhrase, 'id' | 'savedAt' | 'timesPracticed'>): SavedPhrase => {
  const current = getStoredPhrases();
  const existing = current.find(p => p.targetScript === phrase.targetScript || p.romanized.toLowerCase() === phrase.romanized.toLowerCase());
  if (existing) return existing;

  const newPhrase: SavedPhrase = {
    ...phrase,
    id: `phrase-${Date.now()}`,
    savedAt: Date.now(),
    timesPracticed: 0,
  };
  saveStoredPhrases([newPhrase, ...current]);
  return newPhrase;
};

export const removeSavedPhrase = (id: string): void => {
  const current = getStoredPhrases();
  saveStoredPhrases(current.filter(p => p.id !== id));
};

export const updatePhraseScore = (id: string, score: number): void => {
  const current = getStoredPhrases();
  const updated = current.map(p => {
    if (p.id === id) {
      return {
        ...p,
        timesPracticed: (p.timesPracticed || 0) + 1,
        lastScore: score,
      };
    }
    return p;
  });
  saveStoredPhrases(updated);
};

export const getStoredWeakAreas = (): WeakAreaItem[] => {
  try {
    const raw = localStorage.getItem(WEAK_AREAS_KEY);
    if (!raw) {
      saveStoredWeakAreas(INITIAL_WEAK_AREAS);
      return INITIAL_WEAK_AREAS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_WEAK_AREAS;
  }
};

export const saveStoredWeakAreas = (items: WeakAreaItem[]): void => {
  try {
    localStorage.setItem(WEAK_AREAS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save weak areas:', e);
  }
};

export const recordWeakArea = (item: Omit<WeakAreaItem, 'id' | 'errorCount' | 'lastPracticed'>): void => {
  const current = getStoredWeakAreas();
  const index = current.findIndex(w => w.phrase === item.phrase || w.romanized === item.romanized);
  if (index >= 0) {
    current[index].errorCount += 1;
    current[index].lastPracticed = Date.now();
    current[index].tip = item.tip || current[index].tip;
  } else {
    current.unshift({
      ...item,
      id: `weak-${Date.now()}`,
      errorCount: 1,
      lastPracticed: Date.now(),
    });
  }
  saveStoredWeakAreas(current);
};

export const resolveWeakArea = (id: string): void => {
  const current = getStoredWeakAreas();
  saveStoredWeakAreas(current.filter(w => w.id !== id));
};

export const getStoredPracticeSessions = (): PracticeSessionRecord[] => {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const recordPracticeSession = (session: Omit<PracticeSessionRecord, 'id' | 'timestamp'>): void => {
  try {
    const current = getStoredPracticeSessions();
    const newRecord: PracticeSessionRecord = {
      ...session,
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSIONS_KEY, JSON.stringify([newRecord, ...current].slice(0, 30)));
  } catch (e) {
    console.error('Failed to record practice session:', e);
  }
};

export const resetAllLearningHistory = (): void => {
  localStorage.removeItem(PHRASES_KEY);
  localStorage.removeItem(WEAK_AREAS_KEY);
  localStorage.removeItem(SESSIONS_KEY);
};
