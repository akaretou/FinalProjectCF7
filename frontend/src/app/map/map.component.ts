import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header';
import { Footer } from '../footer';
import { Product } from '../models/product.model';
import { API_URL } from '../constants';

import * as L from 'leaflet';


@Component({
  selector: 'map-page',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class MapPage implements OnInit, AfterViewInit {
  map!: L.Map;
  products: Product[] = [];
  markers: L.Marker[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([40.6403, 22.9356], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.map.locate({ setView: true, maxZoom: 15 });

    this.map.on('moveend', () => {
      const bounds = this.map.getBounds();
      this.fetchProducts(bounds);
    });

    this.fetchProducts(this.map.getBounds());
  }

  fetchProducts(bounds: L.LatLngBounds) {
    const params = {
      north: bounds.getNorth().toString(),
      south: bounds.getSouth().toString(),
      east: bounds.getEast().toString(),
      west: bounds.getWest().toString()
    };

    this.http.get<any>(`${API_URL}/listings/map`, { params }).subscribe({
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
              'uploads/' + p.image,
              p.category,
              p.availableUntil
            )
        );
        this.updateMarkers();
      },
      error: (err) => console.error('Error fetching products', err)
    });
  }

  updateMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    const customIcon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      iconSize: [32, 40],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.products.forEach(product => { 
      if (product.geolocation) {
        const marker = L.marker([product.geolocation.lat, product.geolocation.lng],  { icon: customIcon } )
          .addTo(this.map)
          .bindPopup(`
            <div class="text-center" style="width:300px;" >
              <strong>${product.title}</strong><br/>
              ${product.address}<br/>
              <img src="${product.image}" style="width:300px; height:auto; margin-top:4px"/> 
            </div>
          `);
        this.markers.push(marker);
      }
    });
  }
}