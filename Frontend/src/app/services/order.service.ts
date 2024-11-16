import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Order {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  userOrderId: string;
}

export interface OrderDetail {
  id: string;
  price: number;
  quantity: number;
  productId: string;
  orderId: string
}
@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private readonly apiUrl2 = 'https://localhost:7189/api/Order';
  private readonly apiUrl3 = 'https://localhost:7189/api/OrderDetail'; 

  constructor(private http : HttpClient) { }

  getOrdersByUserId(userId: string): Observable<{ $values: Order[] }> {
    return this.http.get<{ $values: Order[] }>(`${this.apiUrl2}/get-orders-by-userId/${userId}`);
  }

  getOrderDetailsByOrderId(orderId: string): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl3}/order/${orderId}`);
  }

  addOrderDetail(orderDetail: { price: number; quantity: number; productId: string; orderId: string }): Observable<void> {
    // Gửi orderDetail trực tiếp mà không cần đóng gói thêm
    return this.http.post<void>(`${this.apiUrl3}/create-orderDetail`, orderDetail);
  }
  

  createOrder(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl2}/create-order`, order);
  }
  
}
