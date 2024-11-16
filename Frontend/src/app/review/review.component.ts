import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReviewService, Review } from '../services/review/review.service';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth.service';
import { Observable, of, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  reviewForm!: FormGroup;
  @Input() productId!: string;
  userId: string | undefined;
  editingReview: Review | null = null;
  showReviews: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    public userService: UserService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    console.log('userId', this.userId);
    this.initializeForm();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  initializeForm(): void {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadReviews(): void {
    if (this.productId) {
      this.reviewService.getReviewsByProduct(this.productId).subscribe({
        next: (response) => {
          if (response && Array.isArray(response.$values)) {
            this.reviews = response.$values;
            this.reviews.forEach(review => {
              this.userService.getUserById(review.userId).pipe(
                switchMap(user => {
                  review.userName = user.userName || 'Unknown User';
                  return of(user.userName);
                }),
                catchError(() => of('Unknown User'))
              ).subscribe();
            });
          } else {
            console.error('Fetched data does not have an array of reviews:', response);
          }
        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
        }
      });
    } else {
      console.warn('Product ID is not defined.');
    }
  }

  addReview(): void {
    if (this.reviewForm.invalid || !this.userId || !this.productId) {
      console.warn('Form is invalid:', this.reviewForm.invalid);
      return;
    }

    const review: Review = {
      comment: this.reviewForm.value.comment,
      userId: this.userId,
      productId: this.productId,
      userName: this.authService.getCurrentUserName() || 'Anonymus User' // Add userName when adding a review
    };

    if (this.editingReview) {
      this.updateReview(this.editingReview, review.comment);
    } else {
      this.reviewService.addComment(review).subscribe({
        next: () => {
          this.loadReviews();
          this.reviewForm.reset();
          alert('Comment added');
        },
        error: (error) => {
          console.error('Error adding review:', error);
        }
      });
    }
  }

  editReview(review: Review): void {
    this.editingReview = review;
    this.reviewForm.setValue({
      comment: review.comment
    });
  }

  updateReview(review: Review, newComment: string): void {
    this.reviewService.updateComment(review.userId, review.productId, newComment).subscribe({
      next: () => {
        this.loadReviews();
        this.reviewForm.reset();
        this.editingReview = null;
      },
      error: (error) => {
        console.error('Error updating review:', error);
      }
    });
  }

  deleteReview(review: Review): void {
    this.reviewService.deleteComment(review.userId, review.productId).subscribe({
      next: () => this.loadReviews(),
      error: (error) => {
        console.error('Error deleting review:', error);
      }
    });
  }

  cancelEdit(): void {
    this.editingReview = null;
    this.reviewForm.reset();
  }

  toggleReviews(): void {
    this.showReviews = !this.showReviews;
    if (this.showReviews) {
      this.loadReviews();
    }
  }
}