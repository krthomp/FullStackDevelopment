import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    const tripCode = this.route.snapshot.paramMap.get('tripCode');
    if (!tripCode) {
      alert("Something went wrong, couldn’t find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode: ' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ["", Validators.required],
      length: ["", Validators.required],
      start: ["", Validators.required],
      resort: ["", Validators.required],
      perPerson: ["", Validators.required],
      image: ["", Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTripById(tripCode)
      .subscribe({
        next: (value: Trip) => {
          this.trip = value;
          // Populate our record into the form
          this.editForm.patchValue(value); // Directly patch the object
          if (!value) {
            alert("Something went wrong, couldn’t find the trip details!");
            this.router.navigate(['']);
          }
        },
        error: (err) => {
          console.error('Error fetching trip details:', err);
          alert("Something went wrong, couldn’t fetch the trip details!");
          this.router.navigate(['']);
        }
      });
  }

  // Getter for easy access to form fields
  get f() { return this.editForm.controls; }

  public onSubmit(): void {
    this.submitted = true;
    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value)
        .subscribe({
          next: (response) => {
            console.log('Trip updated successfully:', response);
            alert('Trip updated successfully!');
            this.router.navigate(['/trips']);
          },
          error: (err) => {
            console.error('Error updating trip:', err);
            alert("Something went wrong, couldn’t update the trip!");
          }
        });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}