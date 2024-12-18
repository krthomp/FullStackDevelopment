import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../storage/storage";
import { User } from "../models/user";
import { AuthResponse } from "../models/authresponse";
import { TripDataService } from "./trip-data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage, 
    private tripDataService: TripDataService
  ) { }

  // Get the token from localStorage
  public getToken(): string | null {
    return this.storage.getItem('trip-token');  // Using 'trip-token' consistently
  }

  // Save the token to localStorage
  public saveToken(token: string): void {
    this.storage.setItem('trip-token', token);  // Using 'trip-token' consistently
  }

  // Login the user
  public login(user: User): Promise<any> {
    return this.tripDataService.login(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }

  // Register the user
  public register(user: User): Promise<any> {
    return this.tripDataService.register(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }

  // Logout the user and remove the token
  public logout(): void {
    this.storage.removeItem('trip-token');  // Corrected to 'trip-token' for consistency
  }

  // Check if the user is logged in by verifying the token expiration
  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  // Get the current logged-in user
  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
      const token: string = this.getToken()!;
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
    return null;  // Return null if not logged in
  }
}
