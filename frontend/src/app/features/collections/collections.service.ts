import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { CollectionDto, TagDto } from '../../shared/models/api.types';

@Injectable({ providedIn: 'root' })
export class CollectionsService {
  private readonly base = `${environment.apiBaseUrl}/collections`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<{ collections: CollectionDto[] }> {
    return this.http.get<{ collections: CollectionDto[] }>(this.base);
  }

  get(id: string): Observable<{ collection: CollectionDto }> {
    return this.http.get<{ collection: CollectionDto }>(`${this.base}/${id}`);
  }

  create(body: Partial<CollectionDto>): Observable<{ collection: CollectionDto }> {
    return this.http.post<{ collection: CollectionDto }>(this.base, body);
  }

  update(id: string, body: Partial<CollectionDto>): Observable<{ collection: CollectionDto }> {
    return this.http.patch<{ collection: CollectionDto }>(`${this.base}/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  listTags(id: string): Observable<{ tags: TagDto[] }> {
    return this.http.get<{ tags: TagDto[] }>(`${this.base}/${id}/tags`);
  }
}
