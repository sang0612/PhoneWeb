import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Brand{
  id : string;
  name : string;
  description : string;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly apiUrl = 'https://localhost:7189/api/Brands';

  constructor(private http: HttpClient) {}

  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/get-all-brands`);
  }

  getBrandById(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/get-by-id/${id}`);
  }

  createBrand(name : string, description : string): Observable<Brand> {
    return this.http.post<Brand>(`${this.apiUrl}/create-brand`, {name,description});
  }

  updateBrand(brand: Brand): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-brand/${brand.id}`, brand);
  }

  deleteBrand(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-brand/${id}`);
  }
}
