import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FadeInOutAnimation, LogoAnimation } from '../core/animations';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
  animations: [LogoAnimation, FadeInOutAnimation],
})
export class SplashComponent {
  isHidden = false;

  constructor() {
    // it will be null if it doesn't exist
    const isShowSplash = sessionStorage.getItem('isShowSplash');
    if (isShowSplash) {
        // don't show splash
        this.isHidden = true;
    } else {
        // show splash
        this.isHidden = false;
    }
    sessionStorage.setItem('isShowSplash', JSON.stringify(false));
}

  ngAfterViewInit() {
    window.onload = (event) => {
      this.hideSplash();
    };
  }

  hideSplash() {
    setTimeout(() => {
      this.isHidden = true;
      console.log('cargo pagina');
    }, 2000);
  }
}
