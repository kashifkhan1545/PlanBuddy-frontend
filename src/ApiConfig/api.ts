import axios from 'axios';
import { Plan } from '../types';

// Set the backend base URL here. 
// On iOS simulator use http://localhost:8787
// On Android emulator use http://10.0.2.2:8787
const BASE ='http://192.168.18.15:8787';

export async function createPlan(goal: string, horizon: 'today' | 'week'): Promise<Plan> {
  const resp = await axios.post(`${BASE}/plan`, { goal, horizon }, { timeout: 60000 });
  return resp.data as Plan;
}
