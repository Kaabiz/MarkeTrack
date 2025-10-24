import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { Page } from '../models/client';   // <-- reuse your Page<T> interface
import { Client } from '../models/client';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  // ---------- OPTION A: simple list (use this if API returns a flat array) ----------
  getCampaigns(): Observable<Campaign[]> {
    const params = new HttpParams().set('t', Date.now().toString());
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    return this.http.get<Campaign[]>(this.apiUrl, { params, headers });
  }

  // ---------- OPTION B: keep your flattening logic (only if API nests "campaigns") ----------
  // getCampaigns(): Observable<Campaign[]> {
  //   const params = new HttpParams().set('t', Date.now().toString());
  //   const headers = new HttpHeaders({
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: '0',
  //   });
  //   return this.http.get<Campaign[]>(this.apiUrl, { params, headers }).pipe(
  //     map((response: any[]) => {
  //       const flattened: Campaign[] = [];
  //       const extract = (c: any) => {
  //         const { campaigns, ...flat } = c;
  //         flattened.push(flat as Campaign);
  //         if (Array.isArray(campaigns)) campaigns.forEach(extract);
  //       };
  //       response.forEach(extract);
  //       return flattened;
  //     })
  //   );
  // }

  createCampaign(c: Campaign) {
    return this.http.post<Campaign>(this.apiUrl, c);
  }

  updateCampaign(id: number, c: Campaign) {
    return this.http.put<Campaign>(`${this.apiUrl}/${id}`, c);
  }

  deleteCampaign(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCampaign(id: number) {
    const params = new HttpParams().set('t', Date.now().toString());
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`, { params });
  }

  // ---------- NEW: audience preview ----------
  audienceCount(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/audience/count`);
  }

  audience(id: number, page = 0, size = 10): Observable<Page<Client>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Client>>(`${this.apiUrl}/${id}/audience`, { params });
  }
}
