import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import { Flashlight } from '@ionic-native/flashlight';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Flashlight,
    Vibration,
    BarcodeScanner,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
