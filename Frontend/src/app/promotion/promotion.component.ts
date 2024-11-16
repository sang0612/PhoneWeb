import { CommonModule } from '@angular/common';
import { Component, Input, isStandalone } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent {
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
}