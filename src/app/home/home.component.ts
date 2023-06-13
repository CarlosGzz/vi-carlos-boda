import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import AOS from 'aos';
import 'add-to-calendar-button';
import {
  SlideInOutAnimationHorizontal,
  FadeInOutAnimation,
  SlideInOutAnimationVertical,
} from 'src/app/core/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    SlideInOutAnimationHorizontal,
    FadeInOutAnimation,
    SlideInOutAnimationVertical,
  ],
})
export class HomeComponent {
  public hoveredElement: any;
  private userId: any;
  title = 'json-read-example';
  invitadosData: any = [];
  url: string = '/assets/invitados.json';
  mesaDeRegalos = [
    'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51069619',
    'https://www.elpalaciodehierro.com/buscar?eventId=376579',
    'https://guadalquivirregalos.com.mx/',
    ' https://www.amazon.com.mx/wedding/share/VioletayCarlos',
  ];

  get isMobile() {
    if (window.screen.width <= 600) {
      return true;
    }
    return false;
  }

  get invitado() {
    if (this.invitadosData.length > 0) {
      return this.invitadosData.find(
        (element: any) => element.id === +this.userId
      );
    }
    return null;
  }

  constructor(private http: HttpClient, route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.userId = params['invitado'];
      console.log(this.userId);
    });
  }

  ngOnInit() {
    AOS.init();
    this.http.get(this.url).subscribe((res) => {
      this.invitadosData = res;
    });
  }

  toggleHover(id: any) {
    this.hoveredElement = id;
  }

  removeHover() {
    this.hoveredElement = null;
  }

  goToMesaRegalos(id: number) {
    window.open(this.mesaDeRegalos[id], '_blank');
  }
}
