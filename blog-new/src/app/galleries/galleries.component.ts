import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../data.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-galleries',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './galleries.component.html',
  styleUrls: ['./galleries.component.css'],
})
export class GalleriesComponent implements OnInit {
  userDetails: any;
  userData: any = {};
  baseAPI: string = 'http://localhost/gallery/gallery-api';
  isModalOpen: boolean = false;
  selectedImage: any = null;
  userImages: any[] = [];
  formData: any;
  applyForm: any;
  cookieService = inject(CookieService);

  constructor(
    private ds: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formData = new FormData();
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));

    this.applyForm = new FormGroup({
      commentText: new FormControl(null, Validators.required),
    });

    this.loadGallery();

    this.ds
      .getRequestWithParams('get-data', { id: this.userDetails.userID })
      .subscribe(
        (response: any) => {
          this.userData = response;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    //THIS IS FOR ALL POST OF THE USERS
    this.ds.getRequest('get-galleries').subscribe(
      (response: any) => {
        this.userImages = response;
        console.log('POSTS', this.userImages);
      },
      (error) => {
        console.error('Error fetching galleries:', error);
      }
    );

    this.loadGallery();
  }

  loadGallery(): void {
    this.ds
      .getRequestWithParams('get-data', { id: this.userDetails.userID })
      .subscribe(
        (response: any) => {
          this.userData = response;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  Insert() {
    this.formData.append('commentText', this.applyForm.value.commentText);
    this.formData.append('userID', this.userDetails.userID);
    this.formData.append('imgID', this.selectedImage.imgID);

    this.ds.sendRequestWithMedia('add-comment', this.formData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
        // alert("Inserted Successfully!");
        console.log(this.applyForm);
        Swal.fire({
          title: 'Inserted Successfully',
          icon: 'success',
        });
        this.router.navigate(['/portfolio']);
        this.loadGallery();
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }

  routeToCreateGallery(): void {
    this.router.navigate(['../creategallery'], { relativeTo: this.route });
  }

  routeToGallery(): void {
    this.router.navigate(['../gallery'], { relativeTo: this.route });
  }

  routeToGalleries(): void {
    this.router.navigate(['../galleries'], { relativeTo: this.route });
  }

  openModal(img: any): void {
    this.selectedImage = img;
    this.isModalOpen = true;
    // Load comments for the selected image
    this.ds
      .getRequestWithParams('get-comments', { imgID: img.imgID })
      .subscribe(
        (response: any) => {
          this.selectedImage.comments = response.comments;
        },
        (error) => {
          console.error('Error fetching comments:', error);
        }
      );
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = null;
  }
}
