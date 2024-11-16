import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Promotion, PromotionService } from '../../services/promotion/promotion.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-promotion-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './promotion-management.component.html',
  styleUrl: './promotion-management.component.css'
})
export class PromotionManagementComponent {
  promotions: Promotion[] = [];
  currentPromotion: Promotion={id: '', name: '', description: '', dateStart: new Date(), dateEnd: new Date()};
  newPromotion: { name: string, description: string, dateStart: Date, dateEnd: Date } = {name:'',description:'',dateStart:new Date,dateEnd:new Date};

  constructor(private promotionService : PromotionService){}
    ngOnInit(){
      this.getAllPromotion();
    }
    getAllPromotion(): void {
      console.log('Fetching all brands...');
      this.promotionService.getAllPromotions().subscribe(
        (data: any) => {
          console.log('Raw data fetched:', data);
          if (data && data.$values) {
            this.promotions = data.$values; // Gán dữ liệu trực tiếp vào mảng brands
            console.log('Brands fetched:', this.promotions);
          } else {
            console.error('Invalid data format:', data);
          }
        },
        (error) => {
          console.error('Error fetching brands:', error);
        }
      );
    }
  
    getPromtionById(promotionId: string): void {
      this.promotionService.getPromotionById(promotionId).subscribe(
        (brand) => {
          this.currentPromotion = brand;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  
    createBrand(name: string, description: string,dateStart : Date,dateEnd:Date): void {
      console.log(name, description);
  
      this.promotionService.createPromotion( name, description,dateStart,dateEnd ).subscribe(
        () => {
          console.log('Brand created successfully');
          this.getAllPromotion();
        },
        (error) => {
          console.error(error);
          if (error.error && error.error.errors) {
            console.error('Error details:', error.error.errors);
          }
        }
      );
    }
  
    updateBrand(): void {
      console.log(this.currentPromotion);
      this.promotionService.updatePromotion(this.currentPromotion).subscribe(
        () => {
          console.log('Brand updated successfully');
          this.getAllPromotion();
        },
        (error) => {
          console.error(error);
          if (error.error && error.error.errors) {
            console.error('Error details:', error.error.errors);
          }
        }
      );
    }
  
    deleteBrand(promotionId: string): void {
      this.promotionService.deletePromotion(promotionId).subscribe(
        () => {
          console.log('Brand deleted successfully');
          this.getAllPromotion();
        },
        (error) => {
          console.error(error);
          if (error.error && error.error.errors) {
            console.error('Error details:', error.error.errors);
          }
        }
      );
    }

    openPromotionDetailModal(promotion: Promotion) {
      this.currentPromotion = promotion;
      const promotionDetailModal = document.getElementById('promotionDetailModal');
      if (promotionDetailModal) {
        const modal = new bootstrap.Modal(promotionDetailModal);
        modal.show();
      }
    }
  
    openCreatePromotionModal() {
      const createPromotionModal = document.getElementById('createPromotionModal');
      if (createPromotionModal) {
        const modal = new bootstrap.Modal(createPromotionModal);
        modal.show();
      }
    }
  }

