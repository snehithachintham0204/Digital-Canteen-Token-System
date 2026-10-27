
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService, Food } from '../services/menu';

@Component({
  selector: 'app-food-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './food-menu.html',
  styleUrl: './food-menu.css'
})
export class FoodMenu implements OnInit {
  menu: Food[] = [];
  loading = true;
  errorMessage = '';

  categories: string[] = [
    'Breakfast',
    'Lunch',
    'Snacks',
    'Desserts',
    'Drinks'
  ];

  private readonly fallbackImage =
    'https://placehold.co/400x250/e8f5e9/176b49?text=Food';

  private readonly foodImages: Record<string, string> = {
    // Breakfast
    'Idli':
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
    'Plain Dosa':
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80',
    'Masala Dosa':
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80',
    'Vada':
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    'Puri':
      'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80',
    'Upma':
      'https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Upma.JPG',
    'Veg Sandwich':
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',

    // Lunch
    'Veg Biryani': '/images/veg-biryani.jpg',
    'Curd Rice':
      'https://commons.wikimedia.org/wiki/Special:FilePath/A_shot_of_Curd_Rice.jpg',
    'Lemon Rice':
      'https://commons.wikimedia.org/wiki/Special:FilePath/Lemon_Rice_02.jpg',
    'Veg Fried Rice':
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80',
    'Veg Noodles':
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    'Chicken Biryani': '/images/chicken-biryani.jpg',
    'Chicken Dum Biryani': '/images/chicken-dum-biryani.jpg',
    'Chicken Fry Biryani': '/images/chicken-fry-biryani.jpg',
    'Egg Biryani': '/images/egg-biryani.jpg',

    // Snacks
    'Samosa':
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    'Veg Puff':
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    'Biscuits':
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80',

    // Desserts
    'Gulab Jamun': '/images/gulab-jamun.jpg',
    'Ice Cream':
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',

    // Drinks
    'Tea':
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    'Coffee':
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    'Milk':
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
    'Badam Milk': '/images/badam-milk.jpg',
    'Fresh Lime Juice': '/images/fresh-lime-juice.jpg'
  };

  constructor(
    private menuService: MenuService,
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
        console.log('Menu loaded:', this.menu.length);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Menu error:', error);
        this.loading = false;
        this.errorMessage =
          'Unable to load the menu. Please check whether the backend is running.';
        this.cdr.detectChanges();
      }
    });
  }

  getFoodsByCategory(category: string): Food[] {
    return this.menu.filter(
      food =>
        food.category?.toLowerCase() === category.toLowerCase()
    );
  }

  getFoodImage(foodName: string): string {
    return this.foodImages[foodName] || this.fallbackImage;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    if (img.src !== this.fallbackImage) {
      img.onerror = null;
      img.src = this.fallbackImage;
    }
  }
}
