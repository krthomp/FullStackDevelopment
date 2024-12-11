import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { Trip } from '../models/trips';
import { TripDataService } from '../services/trip-data.service';
import { trips } from '../data/trips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrls: ['./trip-listing.component.css'],
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {
  trips: Array<any> = trips;
  message: string = '';

  constructor(
    private tripDataService: TripDataService,
    private router: Router
  ) {
    console.log('trip-listing constructor');
  }

  public addTrip(): void {
    this.router.navigate(['/add-trip']);
  }

  private fetchTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        if (value.length > 0) {
          this.message = 'There are ' + value.length + ' trips available.';
        } else {
          this.message = 'There were no trips retrieved from the database';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.fetchTrips();

    // Temp fetch request for testing
    fetch('http://localhost:3000/api/trips')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log('Error: ' + error));
  }
}
