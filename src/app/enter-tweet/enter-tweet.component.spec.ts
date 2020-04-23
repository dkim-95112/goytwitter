import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterTweetComponent } from './enter-tweet.component';

describe('EnterTweetComponent', () => {
  let component: EnterTweetComponent;
  let fixture: ComponentFixture<EnterTweetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterTweetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
