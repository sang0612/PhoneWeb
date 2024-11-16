import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { OrderService } from '../../services/order.service'; // Import OrderService
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { ReviewComponent } from '../../review/review.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, ReviewComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  // product: Product | undefined;
  product: Product = {
    id: '',
    name: 'Default Product',
    price: 0,
    description: 'Default Description',
    image: 'default-image-url',
    branch: ''
  };
  productId: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService // Inject OrderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        console.log('Product ID from URL:', this.productId);
        
        this.productService.getProductById(this.productId).subscribe(
          (product: Product) => {
            console.log('Fetched product:', product); 
            this.product = product;
          },
          (error) => {
            console.error('Error fetching product details:', error);
          }
        );
      }
    });
  }

  // addToCart(): void {
  //   const userId = this.getCurrentUserId(); // Get the current user ID
    
  //   if (userId && this.product) {
  //     this.orderService.getOrdersByUserId(userId).subscribe(
  //       (response) => {
  //         const orders = response?.$values; // Optional chaining to handle possibly undefined response
  //         if (orders && orders.length > 0) { // Check if orders array exists and has at least one element
  //           const firstOrder = orders[0]; // Get the first order
  //           const orderId = firstOrder?.id;
  //         }
  //         })
  //     const orderDetail = {
  //       price: this.product.price,
  //       quantity: 1, // Default quantity
  //       productId: this.product.id, // Ensure this is a string
  //       orderId: '7eb65f09-f3dc-495e-9120-7da00d2b924e' // Replace with the actual order ID
  //     };
  //     console.log(orderDetail.price);
  //     console.log(orderDetail.quantity);
  //     console.log(orderDetail.productId);
  //     console.log(orderDetail.orderId);
  //     this.orderService.addOrderDetail(orderDetail).subscribe(
  //       () => {
  //         console.log('Product added to cart successfully.');
  //       },
  //       (error) => {
  //         console.error('Error adding product to cart:', error);
  //         console.log('Chi tiết lỗi:', error.error);
  //       }
  //     );
  //   } else {
  //     console.error('User ID not found or product is undefined.');
  //   }
  // }

  addToCart(): void {
    const userId = this.getCurrentUserId(); 
    if (userId && this.product) {
      this.orderService.getOrdersByUserId(userId).subscribe(
        (response) => {
          if (response && Array.isArray(response.$values)) {
            const orders = response.$values;
            if (orders && orders.length > 0) { 
              const firstOrder = orders[0];
              if (firstOrder) { 
                const orderId = firstOrder.id;
                const orderDetail = {
                  price: this.product.price,
                  quantity: 1,
                  productId: this.product.id,
                  orderId: orderId
                };
                console.log(orderDetail.price);
                console.log(orderDetail.quantity);
                console.log(orderDetail.productId);
                console.log(orderDetail.orderId);
                this.orderService.addOrderDetail(orderDetail).subscribe(
                  () => {
                    console.log('Sản phẩm đã được thêm vào giỏ hàng thành công.');
                  },
                  (error) => {
                    if (error instanceof SyntaxError) {
                      console.error('Lỗi JSON không hợp lệ:', error.message);
                    } else {
                      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
                      console.log('Chi tiết lỗi:', error.error);
                    }
                  }
                );
              } else {
                console.error('Không tìm thấy đơn hàng nào cho người dùng.');
              }
            } else {
              console.error('Không tìm thấy đơn hàng nào cho người dùng.');
            }
          } else {
            console.error('Phản hồi từ API không hợp lệ.');
          }
        },
        (error) => {
          console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
      );
    } else {
      console.error('Không tìm thấy ID người dùng hoặc sản phẩm không được định nghĩa.');
    }
  }
  
  
  createOrderDetail(orderId: string): void {
    const orderDetail = {
      price: this.product.price,
      quantity: 1,
      productId: this.product.id,
      orderId: orderId
    };
  
    this.orderService.addOrderDetail(orderDetail).subscribe(
      () => {
        console.log('Sản phẩm đã được thêm vào giỏ hàng thành công.');
      },
      (error) => {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        console.log('Chi tiết lỗi:', error.error);
      }
    );
  }

  getCurrentUserId(): string | undefined {
    const loginResultJSON = localStorage.getItem('loginResult');
    const loginResult = loginResultJSON ? JSON.parse(loginResultJSON) : undefined;
    return loginResult ? loginResult.id : undefined;
  }
}
