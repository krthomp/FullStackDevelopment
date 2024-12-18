import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {
  addForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ["", Validators.required],
      name: ["", Validators.required],
      length: ["", Validators.required],
      start: ["", Validators.required],
      resort: ["", Validators.required],
      perPerson: ["", Validators.required],
      image: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  // Getter for easy access to form fields
  get f() { return this.addForm.controls; }

  public onSubmit() {
    this.submitted = true;
    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value)
        .subscribe({
          next: (data: Trip) => {
            console.log(data);
            this.router.navigate(['/trips']);
          },
          error: (err) => {
            console.error('Error adding trip:', err);
            alert("Something went wrong, couldn’t add the trip!");
          }
        });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}