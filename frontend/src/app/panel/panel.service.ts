import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

import { API_URL } from '../constants';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(`${API_URL}/me/listings`, {
      withCredentials: true,
    });
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/me/listing/${id}`, {
      withCredentials: true,
    });
  }

  createProduct(formData: FormData) {
    return this.http.post(`${API_URL}/me/listings`, formData, {
      withCredentials: true,
    });
  }

  updateProduct(id: string, formData: FormData) {
    return this.http.put(`${API_URL}/me/listing/${id}`, formData, {
      withCredentials: true,
    });
  }

  deleteProduct(id: string) {
    return this.http.delete(`${API_URL}/me/listing/${id}`, {
      withCredentials: true,
    });
  }
}
