import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import AOS from 'aos';

class VerticalTimeline {
  blocks: any;
  images: any;
  contents: any;
  offset: any;

  constructor(element: any) {
    this.blocks = element.getElementsByClassName('cd-timeline__block');
    this.images = element.getElementsByClassName('cd-timeline__img');
    this.contents = element.getElementsByClassName('cd-timeline__content');
    this.offset = 0.8;
    this.hideBlocks();
  }

  hideBlocks() {
    //hide timeline blocks which are outside the viewport
    var self = this;
    for (var i = 0; i < this.blocks.length; i++) {
      (function (i) {
        if (
          self.blocks[i].getBoundingClientRect().top >
          window.innerHeight * self.offset
        ) {
          self.images[i].classList.add('cd-timeline__img--hidden');
          self.contents[i].classList.add('cd-timeline__content--hidden');
        }
      })(i);
    }
  }

  showBlocks() {
    var self = this;
    for (var i = 0; i < this.blocks.length; i++) {
      (function (i) {
        if (
          self.contents[i].classList.contains('cd-timeline__content--hidden') &&
          self.blocks[i].getBoundingClientRect().top <=
            window.innerHeight * self.offset
        ) {
          // add bounce-in animation
          self.images[i].classList.add('cd-timeline__img--bounce-in');
          self.contents[i].classList.add('cd-timeline__content--bounce-in');
          self.images[i].classList.remove('cd-timeline__img--hidden');
          self.contents[i].classList.remove('cd-timeline__content--hidden');
        }
      })(i);
    }
  }
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  @ViewChild('firstElement')
  firstElement!: ElementRef;
  firstPosition = 0;
  verticalTimelinesArray: Array<any> = [];
  scrolling: boolean = false;
  windowScroll = 0;
  innerHeight = window.innerHeight;
  timeLineItems = [
    {
      title: 'Civil',
      lugar: 'JW Marriot',
      direccion:
        'Av. del Roble 670, Valle del Campestre, 66265 San Pedro Garza García, N.L.',
      maps: 'http://maps.google.com/?q=JW Marriot, Arboleda, San Pedro Garza Garcia',
      horario: '5:30 pm',
      img: 'signature.png',
    },
    {
      title: 'Misa',
      lugar: 'Santa Engracia',
      direccion:
        'Los Rosales 385, Santa Engracia, 66267 San Pedro Garza García, N.L.',
      maps: 'http://maps.google.com/?q=Parroquia Santa Engracia, San Pedro Garza Garcia',
      horario: '6:30 pm',
      img: 'church.png',
    },
    {
      title: 'Recepcion',
      lugar: 'JW Marriot',
      direccion:
        'Av. del Roble 670, Valle del Campestre, 66265 San Pedro Garza García, N.L.',
      maps: 'http://maps.google.com/?q=JW Marriot, Arboleda, San Pedro Garza Garcia',
      horario: '8:30 pm',
      img: 'champagne-glass.png',
    },
  ];
  scrollerHeight = 0;

  get isMobile() {
    if (window.screen.width <= 600) {
      return true;
    }
    return false;
  }

  ngAfterViewInit() {
    console.log(this.firstElement);
    this.firstPosition = this.firstElement.nativeElement.offsetTop;
    let verticalTimelines = document.getElementsByClassName('js-cd-timeline');
    if (verticalTimelines.length > 0) {
      let addTimelineToArray = (i: number) => {
        this.verticalTimelinesArray.push(
          new VerticalTimeline(verticalTimelines[i])
        );
      };
      for (var i = 0; i < verticalTimelines.length; i++) {
        addTimelineToArray(i);
      }
    }
  }
  @HostListener('window:scroll', ['$event'])
  onMessage() {
    if (!this.scrolling) {
      this.windowScroll = window.pageYOffset;
      this.scrolling = true;
      !window.requestAnimationFrame
        ? setTimeout(() => this.checkTimelineScroll(), 250)
        : window.requestAnimationFrame(() => this.checkTimelineScroll());
    }
    let wscroll = window.pageYOffset;
    if (
      wscroll >= this.firstPosition - window.innerHeight + 100 &&
      wscroll <= this.firstPosition
    ) {
      this.scrollerHeight =
        wscroll - (this.firstPosition - window.innerHeight) - 100;
    }
  }

  checkTimelineScroll(): void {
    this.verticalTimelinesArray.forEach(function (timeline: {
      showBlocks: () => void;
    }) {
      timeline.showBlocks();
    });
    this.scrolling = false;
  }

  goToMap(mapURL: string) {
    window.open(mapURL, '_blank');
  }
}
