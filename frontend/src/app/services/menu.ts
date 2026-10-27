
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Food {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3000/api/menu';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<Food[]> {
    return this.http.get<Food[]>(this.apiUrl);
  }
}
