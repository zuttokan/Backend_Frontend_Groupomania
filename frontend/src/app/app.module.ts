import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { headerComponent } from './home/header/header/header.component';
import { FooterComponent } from './home/footer/footer.component';
import { LoginComponent } from './home/auth/login/login.component';
import { SignupComponent } from './home/auth/signup/signup.component';
import { CreatePostComponent } from './home/create-post/create-post/create-post.component';
import { PostsComponent } from './home/posts/posts/posts.component';
import { AuthInterceptor } from './home/interceptors/auth-interceptor'; //intercepteur des requêtes (vérifier si l'utilisateur est déjà authentifié)
import { EditpostdialogComponent } from './home/edit-post/editpostdialog/editpostdialog.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    headerComponent,
    CreatePostComponent,
    PostsComponent,
    LoginComponent,
    SignupComponent,
    EditpostdialogComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
