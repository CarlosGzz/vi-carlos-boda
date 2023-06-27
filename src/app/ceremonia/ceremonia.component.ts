import { Component, Input } from '@angular/core';
import { Invitado } from '../core/database.service';

@Component({
  selector: 'app-ceremonia',
  templateUrl: './ceremonia.component.html',
  styleUrls: ['./ceremonia.component.css'],
})
export class CeremoniaComponent {
  @Input()
  invitado!: Invitado | null;

  get isMobile() {
    if (window.screen.width <= 600) {
      return true;
    }
    return false;
  }
}
