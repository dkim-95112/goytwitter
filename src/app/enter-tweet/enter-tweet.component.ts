import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TweetService} from '../_services';
import {Tweet} from '../_models';

@Component({
  selector: 'app-enter-tweet',
  templateUrl: './enter-tweet.component.html',
  styleUrls: ['./enter-tweet.component.less']
})
export class EnterTweetComponent implements OnInit {
  @Output() insert = new EventEmitter<Tweet>();
  form: FormGroup;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private tweetService: TweetService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      bodyText: ['test', Validators.required]
    });
  }

  onEnter() {
    this.tweetService.insert(
      this.form.get('bodyText').value
    );
  }
}
