import {Component, Inject} from '@angular/core';
import {TootService} from '../_services';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  templateUrl: './delete-dialog.component.html',
})

export class DeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      tootId: string
    },
    private tootService: TootService,
  ) {
  }

  onDelete() {
    this.tootService.delete(this.data.tootId);
  }
}
