import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import { Backlight } from '@ionic-native/backlight';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import firebase from 'firebase';
import { DataProvider } from '../providers/data/data';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { BatteryStatus } from '@ionic-native/battery-status';

let config={
  apiKey: "AIzaSyBI_MvVhO5o3Z_vgBeyDxarTb9bS1KJ4jc",
  authDomain: "sample-f1534.firebaseapp.com",
  databaseURL: "https://sample-f1534.firebaseio.com",
  projectId: "sample-f1534",
  storageBucket: "",
  messagingSenderId: "966190612602"
};
firebase.initializeApp(config);

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
    Backlight,
    Vibration,
    CallNumber,
    BarcodeScanner,
    Contacts,
    File,
    FileChooser,
    Camera,
    BatteryStatus,
    FingerprintAIO,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider
  ]
})
export class AppModule {}
