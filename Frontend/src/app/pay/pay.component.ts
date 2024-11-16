import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent implements OnInit {
  products: Product[] = [];
  customer: Customer = { name: '', email: '', address: '', phone: '' };
  totalPrice: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Giả lập danh sách sản phẩm trong giỏ hàng
    this.products = [
      { id: 1, name: 'Iphone XS Max', price: 20000000, quantity: 1 },
      { id: 2, name: 'Iphone 15 Pro Max', price: 29000000, quantity: 2 }
    ];
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }

  onSubmit(): void {
    // Xử lý khi người dùng nhấn nút thanh toán
    console.log('Customer Information:', this.customer);
    console.log('Order Products:', this.products);
    console.log('Total Price:', this.totalPrice);
    // Thêm logic xử lý thanh toán tại đây
  }
}
