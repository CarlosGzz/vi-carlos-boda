import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vi-carlos-boda';
  constructor(private analytics: AngularFireAnalytics) {
    this.analytics.logEvent('app_open', {"component": "AppComponent"});
  }
}
