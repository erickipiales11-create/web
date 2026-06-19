import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getMedicines() {
    return this.http.get(`${this.URL}/medicines`);
  }

  createMedicine(data: any) {
    return this.http.post(`${this.URL}/medicines`, data);
  }

  updateMedicine(id: number, data: any) {
    return this.http.put(`${this.URL}/medicines/${id}`, data);
  }

  deleteMedicine(id: number) {
    return this.http.delete(`${this.URL}/medicines/${id}`);
  }
}