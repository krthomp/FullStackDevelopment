import { InjectionToken } from '@angular/core';

// Define an InjectionToken for browser storage
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage // or sessionStorage if you prefer
});
