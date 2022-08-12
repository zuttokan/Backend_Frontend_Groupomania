import { Injectable } from '@angular/core';
import { catchError, mapTo, of, Subject, tap, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Post } from 'src/app/home/models/Post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  posts$ = new Subject<Post[]>();

  constructor(private http: HttpClient, private auth: AuthService) {}

  getPosts() {
    this.http
      .get<Post[]>('http://localhost:3000/api/post')
      .pipe(
        tap((post) => this.posts$.next(post)), // posts$ observable pour actualiser le composant apres chaque requete get
        catchError((error) => {
          console.error(error.error.message);
          return of([]);
        })
      )
      .subscribe();
  }

  getPostById(id: string) {
    return this.http
      .get<Post>('http://localhost:3000/api/post/' + id)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  likePost(id: string, isLiked: boolean) {
    return this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/post/' + id + '/like',
        {
          userId: this.auth.getUserId()
            ? this.auth.getUserId()
            : (localStorage.getItem('userId') as string), // récupérer l'userId authentifié en cas de refresh de la page
          isLiked: isLiked ? true : false,
        }
      )
      .pipe(
        mapTo(isLiked),
        catchError((error) => throwError(error.error.message))
      );
  }

  createPost(post: Post, image: File) {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>('http://localhost:3000/api/post', formData) //formData utilisé pour pouvoir envoyer l'image (en binair) sans l'objet
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  modifyPost(id: string, post: Post, image: string | File) {
    if (typeof image === 'string') {
      return this.http
        .put<{ message: string }>('http://localhost:3000/api/post/' + id, post)
        .pipe(catchError((error) => throwError(error.error.message)));
    } else {
      const formData = new FormData();
      formData.append('post', JSON.stringify(post));
      formData.append('image', image);
      return this.http
        .put<{ message: string }>(
          'http://localhost:3000/api/post/' + id,
          formData
        )
        .pipe(catchError((error) => throwError(error.error.message)));
    }
  }

  deletePost(id: string) {
    return this.http
      .delete<{ message: string }>('http://localhost:3000/api/post/' + id)
      .pipe(catchError((error) => throwError(error.error.message)));
  }
}
