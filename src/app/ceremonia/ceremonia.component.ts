import { Component } from '@angular/core';

@Component({
  selector: 'app-ceremonia',
  templateUrl: './ceremonia.component.html',
  styleUrls: ['./ceremonia.component.css'],
})
export class CeremoniaComponent {

  get isMobile() {
    if (window.screen.width <= 600) {
      return true;
    }
    return false;
  }
}
