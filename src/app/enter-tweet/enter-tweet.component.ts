import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TweetService} from '../_services';
import {InsertedTweetsResponse} from '../_models';

@Component({
  selector: 'app-enter-tweet',
  templateUrl: './enter-tweet.component.html',
  styleUrls: ['./enter-tweet.component.less']
})
export class EnterTweetComponent implements OnInit {
  tweetForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private tweetService: TweetService
  ) {
  }

  ngOnInit(): void {
    this.tweetForm = this.fb.group({
      body_text: ['test', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.tweetForm.controls;
  }

  onEnter() {
    this.tweetService.insertTweet$(
      this.f.body_text.value
    ).subscribe(
      (resp: InsertedTweetsResponse) => {
        console.log('onEnter response: %o', resp);
      },
      err => {
        console.log('onEnter error %o', err);
      },
      () => {
        console.log('onEnter complete');
      }
    );
  }
}
