import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Promotion{
  id : string;
  name : string;
  description : string;
  dateStart : Date;
  dateEnd : Date;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = 'https://localhost:7189/api/Promotion';

  constructor(private http: HttpClient) {}

  getAllPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.apiUrl}/get-all-promotions`);
  }

  getPromotionById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/get-by-id/${id}`);
  }

  createPromotion(name : string , description : string,dateStart:Date,dateEnd:Date): Observable<Promotion> {
    return this.http.post<Promotion>(`${this.apiUrl}/create-promotion`, {name ,description,dateStart,dateEnd});
  }

  updatePromotion(promotion: Promotion): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-promotion/${promotion.id}`, promotion);
  }

  deletePromotion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-promotion/${id}`);
  }
}
