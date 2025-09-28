// src/app/services/campaign.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Campaign } from '../models/campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.apiUrl);
  }
  createCampaign(c: Campaign) { return this.http.post<Campaign>(this.apiUrl, c); }

  updateCampaign(id: number, c: Campaign) { return this.http.put<Campaign>(`${this.apiUrl}/${id}`, c); }

  deleteCampaign(id: number) { return this.http.delete<void>(`${this.apiUrl}/${id}`); }

  getCampaign(id: number) { return this.http.get<Campaign>(`${this.apiUrl}/${id}`); }

}
