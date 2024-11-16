import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

export interface Review {
  comment: string;
  userId: string;
  productId: string;
  userName?: string;
}

export interface ReviewResponse {
  $values: Review[];
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'https://localhost:7189/api/Review';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getReviewsByProduct(productId: string, pageIndex: number = 1, pageSize: number = 10): Observable<ReviewResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ReviewResponse>(`${this.baseUrl}/get-by-productid/${productId}`, { params });
  }

  getReviewsByUser(userId: string, pageIndex: number = 1, pageSize: number = 10): Observable<Review[]> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Review[]>(`${this.baseUrl}/get-by-userid/${userId}`, { params });
  }

  addComment(review: Review): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add-comment`, review, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateComment(userId: string, productId: string, newComment: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update-comment`, 
      { comment: newComment, userId, productId }, 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  deleteComment(userId: string, productId: string): Observable<void> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('productId', productId);
  
    return this.http.delete<void>(`${this.baseUrl}/delete-comment`, { params });
  }
  
}
