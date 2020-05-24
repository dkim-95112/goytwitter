import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-enter-tweet-search',
  templateUrl: './enter-tweet-search.component.html',
  styles: [],
})

export class EnterTweetSearchComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      filter: [''],
    });
  }
}


