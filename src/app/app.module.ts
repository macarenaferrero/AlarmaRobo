import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthComponent } from './Pages/auth/auth.component';
import { SplashComponent } from './Pages/splash/splash.component';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { AngularFireModule } from '@angular/fire/compat';

import { DeviceMotion } from '@awesome-cordova-plugins/device-motion/ngx';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { DeviceOrientation } from '@awesome-cordova-plugins/device-orientation/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx'

@NgModule({
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
     Vibration, DeviceMotion, Flashlight, DeviceOrientation, Media
  ],
  declarations: [
    AppComponent,
    AuthComponent,
    SplashComponent,
    PrincipalComponent
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
  ],
})
export class AppModule {}
