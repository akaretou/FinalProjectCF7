import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/listings`, {
      withCredentials: true,
    });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/listing/${id}`, {
      withCredentials: true,
    });
  }

  updateProduct(id: number, formData: FormData) {
    return this.http.put(`${this.API_URL}/listing/${id}`, formData, {
      withCredentials: true,
    });
  }
}
