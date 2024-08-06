// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
// import Swal from 'sweetalert2';
// import { DataService } from '../../data.service';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-creategallery',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
//   templateUrl: './creategallery.component.html',
//   styleUrls: ['./creategallery.component.css']
// })
// export class CreategalleryComponent implements OnInit {
//   @ViewChild('imageCanvas', { static: false }) imageCanvas!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('imagePreview', { static: false }) imagePreview!: ElementRef<HTMLImageElement>;
//   @ViewChild('cropArea', { static: false }) cropArea!: ElementRef<HTMLDivElement>;
//   applyForm: FormGroup;
//   selectedFile: File | null = null;
//   formData: FormData = new FormData();
//   userDetails: any;
//   originalImageSrc: string = '';
//   startX: number = 0;
//   startY: number = 0;
//   isDragging: boolean = false;
//   cropStartX: number = 0;
//   cropStartY: number = 0;
//   cropWidth: number = 0;
//   cropHeight: number = 0;
//   userData: any  = {}; 

//   constructor(
//     private fb: FormBuilder,
//     private ds: DataService,
//     private route: Router,
//     private aRoute: ActivatedRoute,
//     private cookieService: CookieService
//   ) {
//     this.applyForm = this.fb.group({
//       blogTitle: [null, Validators.required],
//       blogDesc: [null, Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this.userDetails = JSON.parse(this.cookieService.get('user_details'));
//   }



//   Insert() {
//     this.formData.append('blogTitle', this.applyForm.value.blogTitle);
//     this.formData.append('blogDesc', this.applyForm.value.blogDesc);
//     this.formData.append('userID', this.userDetails.userID);

//     this.ds.sendRequestWithMedia('add-blog', this.formData).subscribe(
//       (response) => {
//         console.log('Comment submitted successfully:', response);

//       },
//       (error) => {
//         console.error('Error submitting comment:', error);
//       }
//     );
//   }

//   loadGallery(): void {
//     this.ds.getRequestWithParams("get-data", { id: this.userDetails.userID }).subscribe(
//       (response: any) => {
//         this.userData = response;
//         console.log('userData:', this.userData);
//         console.log('userIMg:', this.userData.img);
       

//       },
//       (error) => {
//         console.error('Error :', error);
//       }
//     );
// }

// routeToGallery(){

//   this.route.navigate([`../gallery`], { relativeTo: this.aRoute });
// }
// }
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-creategallery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './creategallery.component.html',
  styleUrls: ['./creategallery.component.css']
})
export class CreategalleryComponent implements OnInit {
  @ViewChild('imageCanvas', { static: false }) imageCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePreview', { static: false }) imagePreview!: ElementRef<HTMLImageElement>;
  @ViewChild('cropArea', { static: false }) cropArea!: ElementRef<HTMLDivElement>;
  applyForm: FormGroup;
  selectedFile: File | null = null;
  formData: FormData = new FormData();
  userDetails: any;
  originalImageSrc: string = '';
  startX: number = 0;
  startY: number = 0;
  isDragging: boolean = false;
  cropStartX: number = 0;
  cropStartY: number = 0;
  cropWidth: number = 0;
  cropHeight: number = 0;
  userData: any  = {}; 

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.applyForm = this.fb.group({
      blogTitle: [null, Validators.required],
      blogDesc: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));
  }

  Insert() {
    if (this.applyForm.valid) {
      this.formData.append('blogTitle', this.applyForm.value.blogTitle);
      this.formData.append('blogDesc', this.applyForm.value.blogDesc);
      this.formData.append('userID', this.userDetails.userID);

      this.ds.sendRequestWithMedia('add-blog', this.formData).subscribe(
        (response) => {
          console.log('Blog submitted successfully:', response);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your blog has been submitted successfully.',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.routeToGallery();
            }
          });
        },
        (error) => {
          console.error('Error submitting blog:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'There was an error submitting your blog. Please try again.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields.',
      });
    }
  }

  loadGallery(): void {
    this.ds.getRequestWithParams("get-data", { id: this.userDetails.userID }).subscribe(
      (response: any) => {
        this.userData = response;
        console.log('userData:', this.userData);
        console.log('userIMg:', this.userData.img);
      },
      (error) => {
        console.error('Error :', error);
      }
    );
  }

  routeToGallery() {
    this.route.navigate([`../gallery`], { relativeTo: this.aRoute });
  }
}