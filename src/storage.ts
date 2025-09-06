import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plan } from './types';

const KEY = 'PLANBUDDY_LATEST_PLAN';

export async function savePlan(plan: Plan) {
  await AsyncStorage.setItem(KEY, JSON.stringify(plan));
}

export async function loadPlan(): Promise<Plan | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Plan;
  } catch {
    return null;
  }
}
