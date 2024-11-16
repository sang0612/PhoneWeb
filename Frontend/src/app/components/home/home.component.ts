import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from "../../admin/user-management/user-management.component";
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    FooterComponent, 
    ProductListComponent, 
    UserManagementComponent, 
    FormsModule,
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  promotions = [
    {
      title: 'GALAXY Z FOLD6 - ƯU ĐÃI HẤP DẪN',
      description: 'Đang diễn ra',
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://dashboard.cellphones.com.vn/storage/samsung-fold6-km-moi-24-8-2024.png'
    },
    {
      title: 'TẢI APP SMEMBER - NHẬN ƯU ĐÃI',
      description: 'Đang diễn ra',
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://dashboard.cellphones.com.vn/storage/galayxy-buds-3-mo-ban-home-26-7-2024.jpg'
    },
    {
      title: 'MỪNG TỰU TRƯỜNG - NHẬN DEAL CHIẾN',
      description: 'Đang diễn ra',
      image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://dashboard.cellphones.com.vn/storage/thu-cu-2G-Sliding-home.jpg'
    },
  ];

  selectedPriceRange: number | null = null;
  selectedBrand: string | null = null;
  products: any[] = []; // Danh sách sản phẩm

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.filterProducts();
    // Có thể thực hiện một số khởi tạo hoặc tải dữ liệu khi component khởi tạo
  }

  // filterProducts() {
  //   let params: any = {};

  //   if (this.selectedPriceRange !== null) {
  //     params.maxPrice = this.selectedPriceRange;
  //   }

  //   if (this.selectedBrand) {
  //     params.brand = this.selectedBrand;
  //   }

  //   this.http.get('api/filter-products', { params: params }).subscribe((response: any) => {
  //     this.products = response;
  //   });
  // }

  filterProducts(): void {
    let params = new HttpParams();
    if (this.selectedPriceRange !== null) {
      params = params.set('maxPrice', this.selectedPriceRange.toString());
    }
    if (this.selectedBrand !== null) {
      params = params.set('brand', this.selectedBrand);
    }

    this.http.get<{ $values: any[] }>('https://localhost:7189/api/Product/filter-products', { params: params })
  .subscribe(
    (response) => {
      console.log('API response:', response);
        this.products = response.$values; // Truy cập thuộc tính chứa mảng
    },
    (error) => {
      console.error('Error occurred:', error);
    }
  );
  }

  // filterProducts(): void {
  //   const params = new HttpParams()
  //     .set('maxPrice', '2000') // Ví dụ giá trị
  //     .set('brand', 'Apple'); // Ví dụ nhãn hàng

  //   this.http.get<{ $values: any[] }>('https://localhost:7189/api/Product/filter-products', { params: params })
  //     .subscribe(
  //       (response) => {
  //         console.log('API Response:', response); // Kiểm tra phản hồi từ API
  //         this.products = response.$values; // Gán dữ liệu sản phẩm
  //       },
  //       (error) => {
  //         console.error('Error occurred:', error);
  //       }
  //     );
  // }
}
