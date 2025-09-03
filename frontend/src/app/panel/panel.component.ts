import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product} from '../models/product.model'
import { ProductsService } from './panel.service'
import { signal } from '@angular/core';

import { Header } from '../header';
import { Footer } from '../footer';

@Component({
  selector: 'panel-page',
  imports: [RouterOutlet, Header, Footer, CommonModule, FormsModule, RouterModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
  standalone: true,
})

export class PanelPage implements OnInit {
  protected title = 'Panel';

  products = signal<Product[]>([]);
  loading = true;

  constructor(
    private productsService: ProductsService,
    public router: Router
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }
 
  fetchProducts() {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.listings.map(
          (p: any) =>
            new Product(
              p._id,
              p.title,
              p.description,
              p.address,
              p.geolocation,
              p.status,
              'uploads/' + p.image,
              p.category,
              p.availableUntil
            )
        ));
        this.loading = false;
      },
      error: (err) => {
        alert('Σφάλμα λήψης προϊόντων');
        this.loading = false;
      }
    });
  }


  editProduct(product: Product) {
    this.router.navigate(['/panel/product', product.id]);
  }

  deleteProduct(product: Product) {
    if (confirm(`Θέλετε να διαγράψετε οριστικά το αντικείμενο: "${product.title}"?`)) {
      this.productsService.deleteProduct(String(product.id)).subscribe({
      next: (res) => {
        alert('Το αντικείμενο διαγράφηκε!');
        this.fetchProducts()
      },
      error: (err) => {
        alert('Αποτυχία διαγραφής');      
      }
    });
    }
  }
}
