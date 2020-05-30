import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TootService} from '../_services';
import {Toot} from '../_models';

@Component({
  selector: 'app-enter-toot',
  templateUrl: './enter-toot.component.html',
  styleUrls: ['./enter-toot.component.less']
})
export class EnterTootComponent implements OnInit {
  @Output() insert = new EventEmitter<Toot>();
  form: FormGroup;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private tootService: TootService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      bodyText: ['test', Validators.required]
    });
  }

  onEnter() {
    this.tootService.insert(
      this.form.get('bodyText').value
    );
  }
}
