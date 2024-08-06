import { Component, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../data.service';

export interface Status {
  status: {
    message: string;
  };
  // Other properties if exist
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  providers: [CookieService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: any;
  response: any;
  message: any;
  error: any;
  userDetails: any;
  showPassword = false;
  cookieService = inject(CookieService);

  constructor(private ds: DataService, private route: Router) {}

  applyForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    if (this.cookieService.check('user_details')) {
      this.userDetails = JSON.parse(this.cookieService.get('user_details'));
      this.username = this.userDetails.username;
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  Login() {
    if (this.applyForm.valid) {
      this.ds.sendRequestWithoutMedia('login', this.applyForm.value).subscribe(
        (response: any) => {
          if (response.status.message === 'Login successful.') {
            this.cookieService.set(
              'user_details',
              JSON.stringify(response.payload)
            );
            this.userDetails = JSON.parse(
              this.cookieService.get('user_details')
            );
            this.username = this.userDetails.username;

            Swal.fire({
              icon: 'success',
              title: `You're signed in as ${this.username}`,
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

            this.route.navigateByUrl('/gallery');
          } else {
            this.showError(response.status.message);
          }
        },
        (error) => {
          this.showError('Error submitting application.');
          console.error('Error submitting application:', error);
        }
      );
    } else {
      this.showError('Please fill out all required fields.');
    }
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
