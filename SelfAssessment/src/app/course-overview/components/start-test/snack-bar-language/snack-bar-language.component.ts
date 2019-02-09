import { Component, OnInit, Inject } from '@angular/core';
import {  MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snack-bar-language',
  templateUrl: './snack-bar-language.component.html',
  styleUrls: ['./snack-bar-language.component.scss']
})
export class SnackBarLanguageComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string[] ) { }

  ngOnInit() { }

}
