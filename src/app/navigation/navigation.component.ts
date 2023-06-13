import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  @ViewChild('stickyMenu')
  menuElement!: ElementRef;
  sticky: boolean = false;
  currentWindowWidth: number = 0;
  menuPosition: any;

  get showMobileMenu() {
    if (window.screen.width <= 600) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.currentWindowWidth = window.innerWidth;
  }

  ngAfterViewInit() {
    this.menuPosition = this.menuElement.nativeElement.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (this.showMobileMenu) {
      if (windowScroll + window.innerHeight - 50 >= this.menuPosition) {
        this.sticky = true;
      } else {
        this.sticky = false;
      }
    } else {
      if (windowScroll  >= window.innerHeight) {
        this.sticky = true;
      } else {
        this.sticky = false;
      }
    }
  }

  navigateToSection(section: string) {
    let el = document.getElementById(section);
    if (el) {
      var headerOffset = 40;
      var elementPosition = el.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }
}
