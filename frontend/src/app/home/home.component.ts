import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

import { Header } from '../header';
import { Footer } from '../footer';

import { Product, Geo } from '../models/product.model';
import { API_URL } from '../constants';

@Component({
  selector: 'home-page',
  imports: [RouterOutlet, Header, Footer, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class HomePage implements OnInit {
  protected title = 'CF17';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  searchTerm: string = '';

  allProducts: Product[] = [];
  products: Product[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 0;

  ngOnInit() {
    this.fetchListings();
  }

  fetchListings() {
    this.http
      .get<any>(
        API_URL +
          `/listings?page=${this.currentPage}&perPage=${this.itemsPerPage}`
      )
      .subscribe({
        next: (res) => {
          this.products = res.listings.map(
            (p: any) =>
              new Product(
                p.id,
                p.title,
                p.description,
                p.address,
                p.geolocation,
                p.status,
                p.image,
                p.category,
                p.availableUntil
              )
          );
          this.totalPages = res.pages;

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching products', err);
        },
      });
  }

  searchProducts() {
    this.currentPage = 1;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchListings();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
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

  interestedIn(product: Product) {}
}
