import {
  Component, Input,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Toot} from '../_models';
import {TootService} from '../_services';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-toot-card',
  templateUrl: './toot-card.component.html',
  styleUrls: ['./toot-card.component.less']
})
export class TootCardComponent {
  @Input() toot: Toot;

  constructor(
    private tootService: TootService,
    private dialog: MatDialog,
  ) {
  }

  onDelete() {
    this.dialog.open(DeleteDialogComponent, {
      data: {
        tootId: this.toot.id
      }
    });
  }
}
