import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-enter-toot-search',
  templateUrl: './enter-toot-search.component.html',
  styles: [],
})

export class EnterTootSearchComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      filter: [''],
    });
  }
}


