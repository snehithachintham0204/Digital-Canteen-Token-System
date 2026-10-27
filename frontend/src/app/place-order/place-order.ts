
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MenuService, Food } from '../services/menu';

interface CartItem {
  food: Food;
  quantity: number;
}

interface OrderResponse {
  message?: string;
  order?: {
    token?: number | string;
    tokenNumber?: number | string;
  };
  token?: number | string;
  tokenNumber?: number | string;
}

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-order.html',
  styleUrl: './place-order.css'
})
export class PlaceOrder implements OnInit {
  menu: Food[] = [];
  cart: CartItem[] = [];

  studentName = '';
  branch = '';
  year = '';
  rollNumber = '';

  branches: string[] = [
    'Artificial Intelligence',
    'CSE',
    'CSE (AI & ML)',
    'Data Science',
    'Other'
  ];

  years: string[] = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
  ];

  loading = true;
  placingOrder = false;

  errorMessage = '';
  successMessage = '';

  tokenNumber: number | null = null;
  selectedCategory = 'Breakfast';

  categories: string[] = [
    'Breakfast',
    'Lunch',
    'Snacks',
    'Desserts',
    'Drinks'
  ];

  private readonly ordersUrl = 'http://localhost:3000/api/orders';

  constructor(
    private menuService: MenuService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.loading = true;
    this.errorMessage = '';

    this.menuService.getMenu().subscribe({
      next: (data: Food[]) => {
        this.menu = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Menu loading error:', error);
        this.loading = false;
        this.errorMessage =
          error.status === 0
            ? 'Cannot connect to the backend. Start the backend on port 3000.'
            : `Unable to load menu. HTTP ${error.status}.`;
        this.cdr.detectChanges();
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getFoodsByCategory(category: string): Food[] {
    return this.menu.filter(
      food => food.category?.toLowerCase() === category.toLowerCase()
    );
  }

  addToCart(food: Food): void {
    const existing = this.cart.find(
      item => item.food.id === food.id
    );

    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ food, quantity: 1 });
    }

    this.errorMessage = '';
    this.successMessage = '';
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: CartItem): void {
    this.cart = this.cart.filter(
      cartItem => cartItem.food.id !== item.food.id
    );
  }

  get totalItems(): number {
    return this.cart.reduce(
      (total, item) => total + item.quantity, 0
    );
  }

  get totalAmount(): number {
    return this.cart.reduce(
      (total, item) => total + item.food.price * item.quantity, 0
    );
  }

  private parseToken(response: OrderResponse): number | null {
    const rawToken =
      response.order?.token ??
      response.order?.tokenNumber ??
      response.token ??
      response.tokenNumber;

    if (rawToken === undefined || rawToken === null) {
      return null;
    }

    const parsed = Number(rawToken);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    console.error('Order request failed:', error);
    console.error('Backend response:', error.error);

    if (error.status === 0) {
      return 'Cannot connect to the backend. Check port 3000 and CORS.';
    }

    return error.error?.message ||
      `Order failed. HTTP status ${error.status}.`;
  }

  placeOrder(): void {
    if (this.placingOrder) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.studentName.trim() ||
      !this.branch.trim() ||
      !this.year.trim() ||
      !this.rollNumber.trim()
    ) {
      this.errorMessage =
        'Please enter your name, branch, year and roll number.';
      return;
    }

    if (this.cart.length === 0) {
      this.errorMessage = 'Please add at least one food item.';
      return;
    }

    this.placingOrder = true;

    const student = {
      studentName: this.studentName.trim(),
      branch: this.branch,
      year: this.year,
      rollNumber: this.rollNumber.trim()
    };

    const items = this.cart.map(item => ({
      itemId: item.food.id,
      quantity: item.quantity
    }));

    const tokens: number[] = [];
    let index = 0;

    const submitNext = (): void => {
      if (index >= items.length) {
        this.placingOrder = false;

        if (tokens.length > 0) {
          this.tokenNumber = tokens[tokens.length - 1];
          this.cart = [];
          this.successMessage =
            tokens.length === 1
              ? 'Order placed successfully!'
              : 'All items were submitted. Each item has its own token.';
        } else {
          this.errorMessage =
            'Orders were accepted but no token was returned. Check the backend response.';
        }

        this.cdr.detectChanges();
        return;
      }

      const item = items[index];

      this.http.post<OrderResponse>(
        this.ordersUrl,
        {
          ...student,
          itemId: item.itemId,
          quantity: item.quantity
        }
      ).subscribe({
        next: response => {
          console.log('Order response:', response);

          const token = this.parseToken(response);
          if (token !== null) {
            tokens.push(token);
          }

          index++;
          submitNext();
        },
        error: (error: HttpErrorResponse) => {
          this.placingOrder = false;
          this.errorMessage = this.getErrorMessage(error);
          this.cdr.detectChanges();
        }
      });
    };

    submitNext();
  }

  startNewOrder(): void {
    this.cart = [];
    this.tokenNumber = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedCategory = 'Breakfast';
  }
}
