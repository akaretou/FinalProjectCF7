import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Header } from '../header';
import { Footer } from '../footer';

interface Product {
  id: number;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  category: string;
  isFavorite: boolean;
}

@Component({
  selector: 'home-page',
  imports: [RouterOutlet, Header, Footer, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class HomePage implements OnInit {
  protected title = 'CF17';

  searchTerm: string = '';

  allProducts: Product[] = [];
  products: Product[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;

  ngOnInit() {
    this.loadMockProducts();
  }

  loadMockProducts() {
    this.allProducts = [
      {
        id: 1,
        name: 'Wireless Headphones',
        location: 'Athens',
        description: 'Premium wireless headphones with noise cancellation',
        imageUrl: 'https://picsum.photos/300/300?random=headphones',
        category: 'Electronics',
        isFavorite: false,
      },
      {
        id: 2,
        name: 'Cotton T-Shirt',
        location: 'Thessaloniki',
        description: 'Comfortable cotton t-shirt for everyday wear',
        imageUrl: 'https://picsum.photos/300/300?random=tshirt',
        category: 'Clothing',
        isFavorite: false,
      },
      {
        id: 3,
        name: 'Coffee Maker',
        location: 'Patras',
        description: 'Automatic coffee maker with timer',
        imageUrl: 'https://picsum.photos/300/300?random=coffeemaker',
        category: 'Home',
        isFavorite: false,
      },
      {
        id: 4,
        name: 'Smart Watch',
        location: 'Heraklion',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        imageUrl: 'https://picsum.photos/300/300?random=smartwatch',
        category: 'Electronics',
        isFavorite: false,
      },
      {
        id: 5,
        name: 'Yoga Mat',
        location: 'Rhodes',
        description: 'Non-slip yoga mat for exercise and meditation',
        imageUrl: 'https://picsum.photos/300/300?random=yogamat',
        category: 'Sports',
        isFavorite: false,
      },
      {
        id: 6,
        name: 'Bestselling Novel',
        location: 'Chania',
        description: 'Latest bestselling fiction novel',
        imageUrl: 'https://picsum.photos/300/300?random=book',
        category: 'Books',
        isFavorite: false,
      },
      {
        id: 7,
        name: 'Kitchen Blender',
        location: 'Corfu',
        description: 'Powerful kitchen blender for smoothies and food prep',
        imageUrl: 'https://picsum.photos/300/300?random=blender',
        category: 'Home',
        isFavorite: false,
      },
      {
        id: 8,
        name: 'Running Shoes',
        location: 'Santorini',
        description: 'Comfortable running shoes with enhanced support',
        imageUrl: 'https://picsum.photos/300/300?random=runningshoes',
        category: 'Sports',
        isFavorite: false,
      },
      {
        id: 9,
        name: 'Bluetooth Speaker',
        location: 'Larissa',
        description: 'Portable bluetooth speaker with deep bass',
        imageUrl: 'https://picsum.photos/300/300?random=speaker',
        category: 'Electronics',
        isFavorite: false,
      },
      {
        id: 10,
        name: 'Denim Jacket',
        location: 'Mykonos',
        description: 'Classic denim jacket with modern fit',
        imageUrl: 'https://picsum.photos/300/300?random=denimjacket',
        category: 'Clothing',
        isFavorite: false,
      },
      {
        id: 11,
        name: 'Desk Lamp',
        location: 'Nafplio',
        description: 'Adjustable desk lamp with multiple brightness levels',
        imageUrl: 'https://picsum.photos/300/300?random=desklamp',
        category: 'Home',
        isFavorite: false,
      },
      {
        id: 12,
        name: 'Fitness Tracker',
        location: 'Kalamata',
        description: 'Water-resistant fitness tracker with sleep monitoring',
        imageUrl: 'https://picsum.photos/300/300?random=fitnesstracker',
        category: 'Electronics',
        isFavorite: false,
      },
    ];
  
    this.updateDisplayedProducts();
  }

  
  updateDisplayedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.products = this.allProducts.slice(start, end);
    
    this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
  }

  searchProducts() {
    this.currentPage = 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
    this.updateDisplayedProducts();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(
        1,
        this.currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  toggleFavorite(product: Product) {
    product.isFavorite = !product.isFavorite;

    const originalProduct = this.products.find((p) => p.id === product.id);
    if (originalProduct) {
      originalProduct.isFavorite = product.isFavorite;
    }
  }

  interestedIn(product: Product) {}
}
