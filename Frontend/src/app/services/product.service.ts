import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../page/PaginatedResult';

// Define an interface for the product
export interface Product {
  id: string;
  name: string;
  description : string;
  image: string;
  price: number;
  branch: string

  // Add other product fields as necessary
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly APIUrl = 'https://localhost:7189/api/Product'; 

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.APIUrl}/get-all-products`);
  }
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.APIUrl}/get-by-id/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.APIUrl}/create-product`, product);
  }

  updateProduct(id: string, product: Product): Observable<void> {
    return this.http.put<void>(`${this.APIUrl}/update-product/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.APIUrl}/delete-product/${id}`);
  }

  filterProducts(maxPrice?: number, brand?: string): Observable<Product[]> {
    let params = new HttpParams();

    if (maxPrice !== undefined && maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    if (brand) {
      params = params.set('brand', brand);
    }

    return this.http.get<Product[]>(`${this.APIUrl}/filter-products`, { params });
  }

  getProductsByPaging(
    filter: string,
    sortBy: string,
    pageIndex: number,
    pageSize: number
  ): Observable<PaginatedResult<Product>> {
    return this.http.get<PaginatedResult<Product>>(
      `${this.APIUrl}/get-products-by-paging?filter=${filter}&sortBy=${sortBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }
}

