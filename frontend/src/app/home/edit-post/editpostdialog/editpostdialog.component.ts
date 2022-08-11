import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editpostdialog',
  templateUrl: './editpostdialog.component.html',
  styleUrls: ['./editpostdialog.component.scss'],
})
export class EditpostdialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    console.log(this.data.postId);
  }
}
