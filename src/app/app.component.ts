import {Component, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

// Todo: todo
// + Make component for filtering list
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('myDrawer') myDrawer: MatDrawer;
  @ViewChild('myTabs') myTabs: MatTabGroup;
  title = 'tooter';

  constructor(
  ) {
  }

  async onSelectTab(msg: 'login' | 'signup') {
    const nextSelectedIndex = ['login', 'signup'].indexOf(msg)
    if(this.myDrawer.opened) {
      if(this.myTabs.selectedIndex === nextSelectedIndex){
        // Close if already opened and selected
        await this.myDrawer.close()
      } else {
        this.myTabs.selectedIndex = nextSelectedIndex;
      }
    } else {
      await this.myDrawer.open();
      this.myTabs.selectedIndex = nextSelectedIndex;
    }
  }
}
