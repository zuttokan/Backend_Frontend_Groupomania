import { PostsService } from './services/post.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private postService: PostsService, private auth: AuthService) {}

  ngOnInit(): void {
    this.postService.getPosts();
  }
}
