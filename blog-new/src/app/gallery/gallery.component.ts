import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  userDetails: any;
  userData: any = {};
  baseAPI: string = 'http://localhost/gallery/gallery-api';
  isModalOpen: boolean = false;
  selectedImage: any = null;
  Blogs: any = {};
  blogData: any = {};
  applyForm: FormGroup;
  formData: FormData = new FormData();

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.applyForm = this.fb.group({
      blogTitle: [null, Validators.required],
      blogID: [null],
      blogDesc: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.cookieService.get('user_details'));
    this.loadGallery();
    console.log(this.userDetails.userID);

    this.ds
      .getRequestWithParams('get-blog', { id: this.userDetails.userID })
      .subscribe(
        (response: any) => {
          this.Blogs = response;
          console.log('userData:', this.Blogs);
        },
        (error) => {
          console.error('Error :', error);
        }
      );

    this.loadGallery();
  }

  loadGallery(): void {
    this.ds
      .getRequestWithParams('get-blog', { id: this.userDetails.userID })
      .subscribe(
        (response: any) => {
          this.Blogs = response;
          if (this.Blogs.blogs && this.Blogs.blogs.length > 0) {
            // Sort blogs by timestamp in descending order
            this.Blogs.blogs.sort(
              (a: any, b: any) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            );
          }
          console.log('userData:', this.Blogs);
        },
        (error) => {
          console.error('Error :', error);
        }
      );
  }

  Edit(blogID: number): void {
    this.isModalOpen = true;

    this.ds.getRequestWithParams('get-userBlog', { blogID: blogID }).subscribe(
      (response: any) => {
        this.blogData = response;
        console.log('userBlog', this.blogData);
        this.applyForm.patchValue({
          blogID: this.blogData.blogID,
          blogTitle: this.blogData.blogTitle,
          blogDesc: this.blogData.blogDesc,
        });
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  editBlog(): void {
    this.formData = new FormData(); // Clear the formData to prevent duplicate entries
    this.formData.append('blogTitle', this.applyForm.value.blogTitle);
    this.formData.append('blogDesc', this.applyForm.value.blogDesc);
    this.formData.append('blogID', this.applyForm.value.blogID);

    this.ds.sendRequestWithMedia('edit-blog', this.formData).subscribe(
      (response) => {
        console.log('Comment submitted successfully:', response);
        this.isModalOpen = false; // Close the modal after successful edit
        this.loadGallery(); // Reload the gallery to reflect changes
      },
      (error) => {
        console.error('Error submitting comment:', error);
      }
    );
  }

  deleteBlog(blogID: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds
          .getRequestWithParams('delete-blog', { blogID: blogID })
          .subscribe(
            (response: any) => {
              if (response.success) {
                console.log('Blog deleted successfully:', response);
                Swal.fire('Deleted!', 'Your blog has been deleted.', 'success');
                this.loadGallery(); // Reload the gallery to reflect changes
              } else {
                console.error('Error deleting blog:', response.message);
                Swal.fire(
                  'Error!',
                  response.message || 'There was an error deleting the blog.',
                  'error'
                );
              }
            },
            (error) => {
              console.error('Error deleting blog:', error);
              Swal.fire(
                'Error!',
                'There was an error deleting the blog. Please try again.',
                'error'
              );
            }
          );
      }
    });
  }
  routeToCreateBLog(): void {
    this.route.navigate(['../creategallery'], { relativeTo: this.aRoute });
  }

  routeToGallery(): void {
    this.route.navigate([`../gallery`], { relativeTo: this.aRoute });
  }

  routeToGalleries(): void {
    this.route.navigate([`../galleries`], { relativeTo: this.aRoute });
  }

  openModal(img: any): void {
    this.selectedImage = img;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = null;
  }
}
