import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { TagDto } from '../../shared/models/api.types';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly base = `${environment.apiBaseUrl}/tags`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<{ tags: TagDto[] }> {
    return this.http.get<{ tags: TagDto[] }>(this.base);
  }
}
