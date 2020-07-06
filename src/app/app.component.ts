import {Component, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";

// Todo: todo
// + Make component for filtering list
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  @ViewChild('myDrawer') myDrawer: MatDrawer;
  title = 'tooter';

  constructor(
  ) {
  }

  openDrawer() {
    this.myDrawer.open().then(() => {
    });
  }
}
