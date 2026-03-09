"use server";

import { piClient } from './api';

/**
 * OpenClaw action dispatcher.
 * Uses HTTP client (piClient) to communicate with the Pi API.
 */
export async function openClawAction(path: string, payload: any = {}, method: string = "GET") {
  // Normalize the path by removing /api/ if present
  const cleanPath = path.replace(/^\/?api\//, '');
  
  try {
    const data = await piClient.request(cleanPath, payload, method);
    return { success: true, data };
  } catch (error: any) {
    console.error(`HTTP API error [${method} /api/${cleanPath}]:`, error.message);
    return { success: false, error: error.message };
  }
}
