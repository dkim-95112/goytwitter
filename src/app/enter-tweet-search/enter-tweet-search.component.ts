import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-enter-tweet-search',
  templateUrl: './enter-tweet-search.component.html',
  styles: [],
})

export class EnterTweetSearchComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      filter: [''],
    });
  }
}


