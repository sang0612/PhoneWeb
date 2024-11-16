import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartItems: any[] = []

    
  constructor(
    private userService: UserService, 
    private productService: ProductService,
    private orderService: OrderService,
  ) {
    console.log('UserService injected:', this.userService);
  }

  // ngOnInit(): void {
  //   console.log('CartComponent ngOnInit called');
  //   const userId = this.getCurrentUserId();
  //   console.log('Current User ID:', userId);
  //   if (userId) {
  //     this.userService.getOrdersByUserId(userId).subscribe(orders => {
  //       console.log('Orders fetched:', orders);
  //       if (orders && orders.length > 0) {
  //         const orderId = orders[0].id; // lấy Order đầu tiên
  //         this.userService.getOrderDetailsByOrderId(orderId).subscribe(orderDetails => {
  //           console.log('Order Details fetched:', orderDetails);
  //           this.cartItems = orderDetails.map(detail => ({
  //             product: {
  //               name: detail.id,
  //               price: detail.price,
  //               productId: detail.productId,
  //               quantity: detail.quantity,
  //               orderId: detail.orderId
  //             },
  //             quantity: detail.quantity
  //           }));
  //         });
  //       }
  //     }, error => {
  //       console.error('Error fetching orders', error);
  //       console.log(localStorage.getItem('loginResult'));
  //     });
  //   } else {
  //     console.error('No user ID found in local storage');
  //     console.log(localStorage.getItem('loginResult'));
  //   }
  // }

  ngOnInit(): void {
    console.log('CartComponent ngOnInit called');
    const userId = this.getCurrentUserId();
    console.log('Current User ID:', userId);
  
    if (userId) {
      console.log('Fetching orders for user ID:', userId);
      this.orderService.getOrdersByUserId(userId).subscribe((orders: any) => {
        console.log('Orders fetched:', orders);
  
        // Kiểm tra và xử lý theo cấu trúc thực tế của orders
        const ordersArray = orders['$values'] || orders;
        console.log('Orders Array:', ordersArray);
  
        if (ordersArray && ordersArray.length > 0) {
          const orderId = ordersArray[0].id; // Lấy Order đầu tiên
          console.log('Fetching order details for order ID:', orderId);
          this.orderService.getOrderDetailsByOrderId(orderId).subscribe((orderDetails: any) => {
            console.log('Order Details fetched:', orderDetails);
  
            // Kiểm tra cấu trúc của orderDetails
            // if (orderDetails && Array.isArray(orderDetails['$values'])) {
            //   this.cartItems = orderDetails['$values'].map((detail: any) => ({
            //     product: {
            //       name: detail.productId, // Cập nhật theo dữ liệu thực tế
            //       image: 'path/to/image', // Cần cập nhật nếu có thông tin ảnh
            //       price: detail.price
            //     },
            //     quantity: detail.quantity
            //   }));
            if (orderDetails && Array.isArray(orderDetails['$values'])) {
              const productIds = orderDetails['$values'].map((detail: any) => detail.productId);
              this.loadProductDetails(productIds, orderDetails['$values']);
            } else {
              console.error('Order details are not in the expected format:', orderDetails);
            }
          }, error => {
            console.error('Error fetching order details', error);
          });
        } else {
          console.log('No orders found for user.');
        }
      }, error => {
        console.error('Error fetching orders', error);
      });
    } else {
      console.error('No user ID found in local storage');
    }
  }
  

  // ngOnInit(): void {
  //   console.log('CartComponent ngOnInit called');
  //   const userId = this.getCurrentUserId();
  //   console.log('Current User ID:', userId);
  
  //   if (userId) {
  //     console.log('Fetching orders for user ID:', userId);
  //     this.userService.getOrdersByUserId(userId).subscribe((orders: any) => {
  //       console.log('Orders fetched:', orders);
  
  //       if (orders && orders.length > 0) {
  //         const orderId = orders[0].id; // Lấy Order đầu tiên
  //         console.log('Fetching order details for order ID:', orderId);
  //         this.userService.getOrderDetailsByOrderId(orderId).subscribe((orderDetails: any) => {
  //           console.log('Order Details fetched:', orderDetails);
  
  //           // Kiểm tra cấu trúc của orderDetails
  //           if (orderDetails && Array.isArray(orderDetails['$values'])) {
  //             const productIds = orderDetails['$values'].map((detail: any) => detail.productId);
  //             this.loadProductDetails(productIds, orderDetails['$values']);
  //           } else {
  //             console.error('Order details are not in the expected format:', orderDetails);
  //           }
  //         }, error => {
  //           console.error('Error fetching order details', error);
  //         });
  //       } else {
  //         console.log('No orders found for user.');
  //       }
  //     }, error => {
  //       console.error('Error fetching orders', error);
  //     });
  //   } else {
  //     console.error('No user ID found in local storage');
  //   }
  // }
  

  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.cartItems.forEach(item => {
      totalPrice += item.product.price * item.quantity;
    });
    return totalPrice;
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
  }

  getCurrentUserId(): string | undefined {
    const loginResultJSON = localStorage.getItem('loginResult');
    const loginResult = loginResultJSON ? JSON.parse(loginResultJSON) : undefined;
    return loginResult ? loginResult.id : undefined;
  }

  loadProductDetails(productIds: string[], orderDetails: any[]): void {
    const productObservables = productIds.map(id => this.productService.getProductById(id));
    forkJoin(productObservables).subscribe(products => {
      this.cartItems = orderDetails.map((detail: any, index: number) => ({
        product: products[index], // Lấy thông tin sản phẩm từ `products`
        quantity: detail.quantity
      }));
      console.log('Cart Items:', this.cartItems);
    }, error => {
      console.error('Error fetching product details', error);
    });
  }
}
