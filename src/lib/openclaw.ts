import { piClient } from './api';

export async function openClawAction(action: string, payload: any = {}) {
  try {
    const data = await piClient.request(action, payload);
    return { success: true, data };
  } catch (error: any) {
    console.error(`HTTP API error [${action}]:`, error.message);
    return { success: false, error: error.message };
  }
}
