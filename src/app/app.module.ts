import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

import { ReactiveFormsModule } from '@angular/forms';
import { RsvpComponent } from './rsvp/rsvp.component';
import { CountdownComponent } from './countdown/countdown.component';
import { TimelineComponent } from './timeline/timeline.component';
import { CommonModule } from '@angular/common';
import { HotelCardComponent } from './hotel-card/hotel-card.component';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { ListaInvitadosComponent } from './lista-invitados/lista-invitados.component';
import { SplashComponent } from './splash/splash.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    NavigationComponent,
    RsvpComponent,
    CountdownComponent,
    TimelineComponent,
    HotelCardComponent,
    SplashComponent,
  ],
  imports: [
    BrowserModule,
    // provideAnalytics(() => getAnalytics()),
    provideFunctions(() => getFunctions()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDividerModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideDatabase(() => getDatabase()),
  ],
  providers: [ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent, SplashComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
