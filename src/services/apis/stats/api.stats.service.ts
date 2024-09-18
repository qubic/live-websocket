import { LatestStatsResponse } from './api.stats.model';
import { environment } from '../../../environments/environment';

export class ApiStatsService {
  private basePath: string = environment.apiUrl;

  public async getLatestStats(): Promise<LatestStatsResponse> {
    const localVarPath = '/v1/latest-stats';
    
    try {
      const response = await fetch(`${this.basePath}${localVarPath}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Überprüfen, ob die Antwort erfolgreich ist
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // JSON-Daten analysieren
      const data: LatestStatsResponse = await response.json();
      console.log('Response from getLatestStats:', data);
      return data;

    } catch (error) {
      console.error('Error fetching latest stats:', error);
      throw error;
    }
  }
}
