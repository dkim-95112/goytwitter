import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {Toot} from '../_models';
import {TootService} from '../_services';

@Component({
  selector: 'app-toot-card',
  templateUrl: './toot-card.component.html',
  styleUrls: ['./toot-card.component.less']
})
export class TootCardComponent {
  @Input() toot: Toot;

  constructor(private tootService: TootService) {
  }

  onEdit() {
    console.log('onEdit');
  }

  onDelete() {
    console.log('onDelete');
    this.tootService.delete(this.toot.id);
  }
}
