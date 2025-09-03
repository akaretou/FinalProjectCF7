import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Product, Geo } from '../models/product.model';
import { ProductsService } from './panel.service';

import { Header } from '../header';
import { Footer } from '../footer';

import * as L from 'leaflet';

@Component({
  selector: 'product-page',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrl: './panel.css',
})
export class ProductPage implements OnInit {
  productId: string | null= "new";
  product: Product = {} as Product;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  
  locationAvailable = false;

  removeProductImage = false;

  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
    
  }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id') !== 'new') {
      this.productId = String(this.route.snapshot.paramMap.get('id'));
      this.productsService.getProduct(this.productId).subscribe({
        next: (res) => {
          let geo = null;
          if (res.geolocation?.lat && res.geolocation?.lat) {
            geo = new Geo(res.geolocation.lat, res.geolocation.lng);
          }
          console.log(res)
          this.product = new Product(
            res._id,
            res.title,
            res.description,
            res.address,
            geo,
            res.status,
            res.image,
            res.category,
            ''
          );
          
          if (geo) {
            this.setupMap(Number(this.product.geolocation?.lat), Number(this.product.geolocation?.lng));
          }
          this.locationAvailable = false;

          if (res.image) {
            this.imagePreview = `uploads/${res.image}`;
          }
          this.cdr.detectChanges();

        },
        error: (err) => {
          console.error('Failed to fetch product', err);
          this.router.navigate(['/panel']);
        },
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.product.geolocation = new Geo(position.coords.latitude, position.coords.longitude);
          this.setupMap(this.product.geolocation.lat, this.product.geolocation.lng);

          this.locationAvailable = true;

          this.cdr.detectChanges();
        },
        (error) => {
          this.locationAvailable = false;
          this.cdr.detectChanges();
        }
      );
    }
  }

  setupMap(lat: number, lng: number) {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.product.geolocation = new Geo(position.lat, position.lng);
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.product.image = '';
    this.removeProductImage = true;
  }

  save() {
    let lat = String(this.product.geolocation?.lat);
    let lng = String(this.product.geolocation?.lng);

    const formData = new FormData();
    formData.append('title', this.product.title);
    formData.append('description', this.product.description);
    formData.append('address', this.product.address);
    formData.append('latitute', lat);
    formData.append('longitute', lng);
    formData.append('status', String(this.product.status));
    formData.append('category', this.product.category);

    if (this.removeProductImage) {
      formData.append('removeImage', 1);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.route.snapshot.paramMap.get('id') !== 'new') {
      this.productsService.updateProduct(String(this.productId), formData).subscribe({
        next: () => {
          alert('Το αντικείμενο ενημερώθηκε επιτυχώς!');
          this.router.navigate(['/panel']);
        },
        error: (err) => {
          alert('Σφάλμα καταχώρησης');
        },
      });
    } else {
      this.productsService.createProduct(formData).subscribe({
        next: () => {
          alert('Το αντικείμενο καταχωρήθηκε επιτυχώς!');
          this.router.navigate(['/panel']);
        },
        error: (err) => {
          alert('Σφάλμα καταχώρησης');
        },
      });
    }
  }
}
