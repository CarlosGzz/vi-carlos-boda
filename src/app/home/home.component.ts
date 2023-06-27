import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import AOS from 'aos';
import 'add-to-calendar-button';
import {
  SlideInOutAnimationHorizontal,
  FadeInOutAnimation,
  SlideInOutAnimationVertical,
} from 'src/app/core/animations';
import { Hotel } from '../hotel-card/hotel-card.component';
import { DatabaseService, Invitado } from '../core/database.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

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
  mesaDeRegalos = [
    {
      nombre: 'Liverpool',
      logo: 'liverpoolLogo.png',
      codigo: '51069619',
      url: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/51069619',
    },
    // {
    //   nombre: 'Palacio de Hierro',
    //   logo: 'palacioLogo.png',
    //   codigo: '376579',
    //   url: 'https://www.elpalaciodehierro.com/buscar?eventId=376579',
    // },
    {
      nombre: 'Regalos Guadalquivir',
      logo: 'guadalquivirLogo.png',
      codigo: 'Boda Violeta y Carlos',
      url: 'https://goo.gl/maps/xZBzj3rHhpLnZVKp6',
    },
    {
      nombre: 'Amazon',
      logo: 'amazonLogo.png',
      codigo: 'VioletayCarlos',
      url: ' https://www.amazon.com.mx/wedding/share/VioletayCarlos',
    },
  ];
  hoteles: Array<Hotel> = [
    {
      nombre: 'JW Marriot',
      logo: 'jwlogo.png',
      imagenExterior: 'jwimgext.jpg',
      imagenHabitacion: 'jwimghab.jpg',
      descuento: 'Boda Violeta y Carlos',
      url: 'https://www.marriott.com/en-us/hotels/mtyjw-jw-marriott-hotel-monterrey-valle/overview/',
      direccion:
        'Avenida del Roble 670, Valle del Campestre, San Pedro Garza García, Nuevo Leon, Mexico, 66265',
      telefono: '+52 81-8850-6700',
    },
    {
      nombre: 'Westin',
      logo: 'westinlogo.png',
      imagenExterior: 'westinext.jpg',
      imagenHabitacion: 'westinhab.jpg',
      descuento: 'Boda Violeta y Carlos',
      url: 'https://www.marriott.com/es/hotels/mtywi-the-westin-monterrey-valle/overview/',
      direccion:
        'Ave. Manuel Gomez Morin Y Rio Missouri, Punto Valle, 66220 San Pedro Garza García, N.L.',
      telefono: '+52 81-2713-3100',
    },
    {
      nombre: 'NH Collection',
      logo: 'nhlogo.png',
      imagenExterior: 'nhext.jpg',
      imagenHabitacion: 'nhhab.jpg',
      descuento: '',
      url: 'https://www.nh-hoteles.es/hotel/nh-collection-monterrey-san-pedro',
      direccion:
        'Av. José Vasconcelos 402, Zona la Alianza, 66268 Monterrey, N.L.',
      telefono: '+52 81-8173-1800',
    },
    // {
    //   nombre: 'Holiday Inn',
    //   logo: 'hinnlogo.png',
    //   imagenExterior: 'hinnext.jpg',
    //   imagenHabitacion: 'hinnhab.jpg',
    //   descuento: '',
    //   url: 'https://www.ihg.com/holidayinnexpress/hotels/us/en/monterrey/mtyrr/hoteldetail',
    //   direccion:
    //     'Av. José Vasconcelos 345-Oriente, Santa Engracia, 66267 Monterrey, N.L.',
    //   telefono: '+52 81-88506700',
    // },
  ];

  get isMobile() {
    if (window.screen.width <= 600) {
      return true;
    }
    return false;
  }

  get invitado(): Invitado | null {
    this.invitadosService.invitado;
    if (this.invitadosService.invitado) {
      return this.invitadosService.invitado;
    }
    return null;
  }

  get listaInvitados() {
    if (this.invitadosService.invitados) {
      return this.invitadosService.invitados;
    }
    return [];
  }

  constructor(
    private http: HttpClient,
    route: ActivatedRoute,
    private invitadosService: DatabaseService,
    private analytics: AngularFireAnalytics
  ) {
    route.params.subscribe((params) => {
      this.userId = params['invitado'];
      if (this.userId) {
        this.analytics.logEvent('home with user id: ' + this.userId, {
          component: 'Home Component',
        });
        this.invitadosService.getInvitado(this.userId);
        if (this.invitado?.estatusDeInvitacion === 'no visto') {
          this.invitadosService.update(this.userId, {
            estatusDeInvitacion: 'visto',
          });
        }
      } else {
        this.analytics.logEvent('home without user id ', {
          component: 'Home Component',
        });
        this.invitadosService.retrieveInvitados();
      }
    });
  }

  ngOnInit() {
    AOS.init();
    // this.addKeyToJSON();
  }

  toggleHover(id: any) {
    this.hoveredElement = id;
  }

  removeHover() {
    this.hoveredElement = null;
  }

  goToMesaRegalos(url: string) {
    window.open(url, '_blank');
  }

  updateInvitado(invitadoActualizado: Invitado) {
    this.invitadosService.update(this.userId, invitadoActualizado);
  }

  addKeyToJSON() {
    let keyValidatorArray: any = [];
    this.http.get('/assets/invitados.json').subscribe((res: any) => {
      let newJson: any = {
        invitados: {},
      };
      res.invitados.forEach((element: any) => {
        let newKey = element.nombre.replace(/\s/g, '');
        newKey = newKey.replace(/\./g, '');
        newKey = newKey.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        newKey = newKey.toLowerCase();
        if (keyValidatorArray.includes(newKey)) {
          let increment = 1;
          while (keyValidatorArray.includes(newKey)) {
            newKey = newKey + increment;
            increment++;
          }
        }
        keyValidatorArray.push(newKey);
        newJson.invitados[newKey] = element;
      });
      console.log(
        '🚀 ~ file: home.component.ts:126 ~ HomeComponent ~ this.http.get ~ JSON.stringify(newJson):',
        JSON.stringify(newJson)
      );
    });
  }
}
