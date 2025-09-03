import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

import { API_URL } from '../constants';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_URL}/listings`, {
      withCredentials: true,
    });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${API_URL}/listing/${id}`, {
      withCredentials: true,
    });
  }

  updateProduct(id: number, formData: FormData) {
    return this.http.put(`${API_URL}/listing/${id}`, formData, {
      withCredentials: true,
    });
  }
}
