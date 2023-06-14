import { Component, Input } from '@angular/core';
export interface Hotel {
  nombre: string;
  logo: string;
  imagenExterior: string;
  imagenHabitacion: string;
  descuento: string;
  url: string;
  direccion: string;
  telefono: string
}
@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.css'],
})
export class HotelCardComponent {
  @Input() hotel: Hotel | undefined;
  styleBackgroundImg = 'background-image: "../../assets/images/"';

  goToHotel(hotelURL: string) {
    window.open(hotelURL, '_blank');
  }
}
