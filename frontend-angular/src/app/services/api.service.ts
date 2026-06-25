import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en API:', error);
    return throwError(() => error);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials)
      .pipe(catchError(this.handleError));
  }

  getMedicamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicamentos`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getMedicamento(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicamentos/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createMedicamento(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicamentos`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateMedicamento(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medicamentos/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteMedicamento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medicamentos/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getFarmacias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/farmacias`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getFarmacia(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/farmacias/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createFarmacia(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/farmacias`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateFarmacia(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/farmacias/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteFarmacia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/farmacias/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/movimientos`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getPrescripciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prescripciones`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
