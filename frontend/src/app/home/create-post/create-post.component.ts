import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, EMPTY, tap, catchError } from 'rxjs';
import { Post } from 'src/app/home/models/Post.model';
import { EditPostComponent } from '../edit-post/editpost.component';
import { AuthService } from '../services/auth.service';
import { PostsService } from '../services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  postForm!: UntypedFormGroup;
  mode!: string;
  post!: Post;
  errorMsg!: string;
  imagePreview!: string;

  @Input() isEdit: boolean = false;
  @Input() postId: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostsService,
    private auth: AuthService,
    private dialogRef: MatDialogRef<EditPostComponent>
  ) {}

  ngOnInit() {
    this.mode = this.isEdit ? 'edit' : 'new';
    this.route.params
      .pipe(
        switchMap((params) => {
          if (this.mode === 'new') {
            this.initEmptyForm();
            return EMPTY;
          } else {
            return this.postService.getPostById(this.postId);
          }
        }),
        tap((post) => {
          if (post) {
            this.post = post;
            this.initModifyForm(post);
          }
        }),
        catchError((error) => (this.errorMsg = JSON.stringify(error)))
      )
      .subscribe();
  }

  initEmptyForm() {
    this.postForm = this.formBuilder.group({
      description: [null, Validators.required],
      image: [null, Validators.required],
    });
    this.imagePreview = '';
  }

  initModifyForm(post: Post) {
    this.postForm = this.formBuilder.group({
      description: [post.description, Validators.required],
      image: [post.imageUrl, Validators.required],
    });
    this.imagePreview = this.post.imageUrl;
  }

  onSubmit() {
    const newPost = new Post();
    newPost.description = this.postForm.get('description')!.value;
    newPost.userId = this.auth.getUserId()
      ? this.auth.getUserId()
      : (localStorage.getItem('userId') as string);
    newPost.userEmail = this.auth.getUserEmail()
      ? this.auth.getUserEmail()
      : (localStorage.getItem('userEmail') as string);
    newPost.date = new Date().toISOString();
    console.log(newPost.userEmail);
    if (this.mode === 'new') {
      this.postService
        .createPost(newPost, this.postForm.get('image')!.value)
        .pipe(
          tap(({ message }) => {
            this.initEmptyForm();
            this.postService.getPosts();
          }),
          catchError((error) => {
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();
    } else if (this.mode === 'edit') {
      this.postService
        .modifyPost(this.post._id, newPost, this.postForm.get('image')!.value)
        .pipe(
          tap(({ message }) => {
            this.dialogRef.close();
            this.postService.getPosts();
          }),
          catchError((error) => {
            this.errorMsg = error.message;
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.postForm.get('image')!.setValue(file);
    this.postForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
