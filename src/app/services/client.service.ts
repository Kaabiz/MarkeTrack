import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, Page } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8012/api/clients';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '1000');
    
    return this.http.get<Page<Client>>(`${this.apiUrl}/all`, { params })
      .pipe(
        map(response => response.content)
      );
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchClients(query: string): Observable<Client[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('size', '1000');
    
    return this.http.get<Page<Client>>(`${this.apiUrl}/all`, { params })
      .pipe(
        map(response => response.content)
      );
  }

  getClientsByCriteria(criteria: any): Observable<Client[]> {
    return this.http.post<Client[]>(`${this.apiUrl}/filter`, criteria);
  }
}