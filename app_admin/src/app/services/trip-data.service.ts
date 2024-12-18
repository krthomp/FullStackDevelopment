import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage/storage';
import { AuthResponse } from '../models/authresponse';
import { Trip } from '../models/trip';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api'; // Replace with your actual API base URL

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage // Inject localStorage or sessionStorage
  ) {}

  // Function to make authentication API calls (login/register)
  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post<AuthResponse>(url, user)
      .toPromise()
      .catch(this.handleError);
  }

  // Login method using the makeAuthApiCall function
  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  // Register method using the makeAuthApiCall function
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  // Get all trips
  public getTrips(): Observable<Trip[]> {
    const url: string = `${this.apiBaseUrl}/trips`;
    return this.http.get<Trip[]>(url);
  }

  // Get a single trip by ID
  public getTripById(tripId: string): Observable<Trip> {
    const url: string = `${this.apiBaseUrl}/trips/${tripId}`;
    return this.http.get<Trip>(url);
  }

  // Add a new trip
  public addTrip(tripData: Trip): Observable<Trip> {
    const url = `${this.apiBaseUrl}/trips`;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getItem('travlr-token')}`, // Use injected localStorage
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<Trip>(url, tripData, httpOptions);
  }

  // Update an existing trip
  public updateTrip(tripData: Trip): Observable<Trip> {
    const url = `${this.apiBaseUrl}/trips/${tripData._id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getItem('travlr-token')}`,
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put<Trip>(url, tripData, httpOptions);
  }

  // Delete a trip by ID
  public deleteTrip(tripId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/trips/${tripId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getItem('travlr-token')}`,
      }),
    };
    return this.http.delete<any>(url, httpOptions);
  }

  // Error handling method
  private handleError(error: any): Promise<any> {
    console.error('API request error:', error);
    return Promise.reject(error.message || error);
  }
}