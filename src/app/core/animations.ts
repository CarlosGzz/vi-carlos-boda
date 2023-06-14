import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
  query,
  stagger,
  keyframes,
} from '@angular/animations';

export const FadeInOutAnimation = [
  trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('1ms ease-in-out', style({ visibility: 'visible' })),
      animate('600ms ease-in-out', style({ 'max-height': '500px' })),
      animate('800ms ease-in-out', style({ opacity: '1' })),
    ]),
    transition(':leave', [
      animate('400ms ease-in-out', style({ opacity: '0' })),
      animate('600ms ease-in-out', style({ 'max-height': '0px' })),
      animate('700ms ease-in-out', style({ visibility: 'hidden' })),
    ]),
  ]),
];

export const SlideInOutAnimationHorizontal = [
  trigger('slideInOutFromLeft', [
    transition(':enter', [
      style({ transform: 'translateX(-30%)' }),
      animate(
        '1ms ease-in-out',
        style({
          visibility: 'visible',
        })
      ),
      animate('800ms ease-in-out', style({ transform: 'translateX(0%)' })),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateX(-100%)' })),
    ]),
  ]),
  trigger('slideInOutFromRight', [
    transition(':enter', [
      style({ transform: 'translateX(30%)' }),
      animate(
        '1ms ease-in-out',
        style({
          visibility: 'visible',
        })
      ),
      animate('800ms ease-in-out', style({ transform: 'translateX(0%)' })),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
    ]),
  ]),
];

export const SlideInOutAnimationVertical = [
  trigger('slideInOutFromTop', [
    transition(':enter', [
      style({ transform: 'translateY(-30%)' }),
      animate(
        '1ms ease-in-out',
        style({
          visibility: 'visible',
        })
      ),
      animate('800ms ease-in-out', style({ transform: 'translateY(0%)' })),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateY(-100%)' })),
    ]),
  ]),
  trigger('slideInOutFromBottom', [
    state('slidein', style({ transform: 'translateY(50%)' })),
    transition('slidein => *', [
      style({ transform: 'translateY(30%)' }),
      animate(
        '1ms ease-in-out',
        style({
          visibility: 'visible',
        })
      ),
      animate('800ms ease-in-out', style({ transform: 'translateY(0%)' })),
    ]),
    transition(':enter', [
      style({ transform: 'translateY(30%)' }),
      animate(
        '1ms ease-in-out',
        style({
          visibility: 'visible',
        })
      ),
      animate('800ms ease-in-out', style({ transform: 'translateY(0%)' })),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateY(100%)' })),
    ]),
  ]),
];

export const LogoAnimation = [
  trigger('vPath', [
    transition(':enter', [
      style({ 'stroke-dashoffset': '1000' }),
      animate(5000, style({ 'stroke-dashoffset': '0', fill: '#b5a642' })),
    ]),
  ]),
  trigger('cPath', [
    transition(':enter', [
      style({ 'stroke-dashoffset': '1000', fill: '#ffffff' }),
      animate(5000, style({ 'stroke-dashoffset': '370', fill: '#b5a642' })),
    ]),
    transition(':leave', [
      animate(5000, style({ 'stroke-dashoffset': '370', fill: '#b5a642' })),
    ]),
  ]),
];
