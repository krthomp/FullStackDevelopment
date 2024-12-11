import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trips';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css'] // Correcting "styleUrl" to "styleUrls"
})
export class TripCardComponent implements OnInit {
  @Input('trip') trip!: Trip; // Ensuring type safety with Trip model

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public editTrip(): void {
    this.router.navigate(['/edit-trip', this.trip.code]);
  }
}
