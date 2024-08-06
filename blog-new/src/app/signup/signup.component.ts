import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  applyForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),

    agreeTerms: new FormControl(false, [Validators.requiredTrue]), // Added agreeTerms control
  });

  constructor(private ds: DataService, private router: Router) {}

  Signup() {
    if (this.applyForm.valid) {
      this.ds.sendRequest('add-user', this.applyForm.value).subscribe(
        (response: any) => {
          console.log('Application submitted successfully:', response);
          if (
            response.status &&
            response.status.message === 'User registered successfully.'
          ) {
            this.showSuccess('Registration successful!');
            this.router.navigateByUrl('login');
          } else {
            this.showError(
              response.status
                ? response.status.message
                : 'Unknown error occurred.'
            );
          }
        },
        (error) => {
          console.error('Error submitting application:', error);
          this.showError('Error submitting application. Please try again.');
        }
      );
    } else {
      this.showError('Please fill out all required fields correctly.');
    }
  }

  showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  }

  showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  }
}
