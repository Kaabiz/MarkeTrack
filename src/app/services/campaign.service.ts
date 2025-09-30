import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { Campaign } from '../models/campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) {}

  // The key fix in getCampaigns() method
  
  getCampaigns(): Observable<Campaign[]> {
    // Add timestamp to prevent caching
    const params = new HttpParams().set('t', new Date().getTime().toString());
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    return this.http.get<any[]>(this.apiUrl, { params, headers })
      .pipe(
        map(response => {
          console.log('Original API response:', response);
          
          // Create a flat array of all campaigns
          const flattenedCampaigns: Campaign[] = [];
          
          // Function to recursively extract campaigns
          const extractCampaigns = (campaign: Campaign) => {
            // Clone the campaign without the nested campaigns
            const { campaigns, ...campaignWithoutNested } = campaign;
            flattenedCampaigns.push(campaignWithoutNested as Campaign);
            
            // Process nested campaigns if they exist
            if (campaigns && Array.isArray(campaigns)) {
              campaigns.forEach(nestedCampaign => extractCampaigns(nestedCampaign));
            }
          };
          
          // Process each top-level campaign
          response.forEach(campaign => extractCampaigns(campaign));
          
          console.log('Flattened campaigns:', flattenedCampaigns);
          return flattenedCampaigns;
        })
      );
  }
  
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
    const params = new HttpParams().set('t', new Date().getTime().toString());
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`, { params }); 
  }
}