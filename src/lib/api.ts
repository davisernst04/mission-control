/**
 * Simple HTTP fetch client for the Pi REST API.
 */
class PiApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    // Ensure no trailing slash
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
  }

  public async request(path: string, payload: any = {}, method: string = 'GET'): Promise<any> {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`/api${cleanPath}`, this.baseUrl);

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(payload);
    } else if (Object.keys(payload).length > 0) {
      // Add query parameters for GET requests
      Object.keys(payload).forEach(key => url.searchParams.append(key, payload[key]));
    }

    const response = await fetch(url.toString(), {
      ...options,
      cache: 'no-store', // Disable caching for real-time data
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText || response.statusText}`);
    }

    const json = await response.json();
    // Handle { success: true, data: ... } format
    if (json.success && json.data !== undefined) {
      return json.data;
    }
    return json;
  }
}

// Export a singleton instance
export const piClient = new PiApiClient();
