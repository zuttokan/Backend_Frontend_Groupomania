import { BehaviorSubject, catchError, EMPTY, Observable, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { EditPostComponent } from '../edit-post/editpost.component';
import { Post } from '../models/Post.model';
import { PostsService } from '../services/post.service';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  post$!: Observable<Post>;
  userId!: string;
  liked!: boolean;
  isLikedValue: boolean = false;
  likes!: number;
  errorMessage!: string;
  posts$ = new BehaviorSubject<Post[]>([]);
  userAdmin!: boolean;
  constructor(
    private postService: PostsService,
    private dialog: MatDialog,
    private auth: AuthService,
    private router: Router
  ) {
    this.userAdmin = this.auth.getUserAdmin();
    //console.log(this.userAdmin);
  }
  openDialog(postId: string) {
    /*opens the popin whose content is "editpost"*/
    const dialogRef = this.dialog.open(EditPostComponent, {
      data: {
        postId: postId,
      },
    });
  }

  ngOnInit() {
    this.userAdmin = this.auth.getUserAdmin();
    this.userId = this.auth.getUserId()
      ? this.auth.getUserId()
      : (localStorage.getItem('userId') as string);
    this.postService.posts$.subscribe((posts: Post[]) => {
      this.posts$.next(posts);
    });
  }
  onDelete(postId: string) {
    this.postService
      .deletePost(postId)
      .pipe(
        tap((message) => {
          console.log(message);
          this.postService.getPosts();
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }

  like(value: any) {
    this.isLikedValue = value;
  }

  onLike(postId: string, isLiked: boolean) {
    this.postService
      .likePost(postId, isLiked)
      .pipe(
        tap((liked) => {
          this.postService.getPosts();
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }
}
