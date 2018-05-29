import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { Flashlight } from '@ionic-native/flashlight';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  options: BarcodeScannerOptions;
encodText:string="";
encodedData:any={};
scannedData:any={};

  constructor(public navCtrl: NavController,private vibration: Vibration,private flashlight: Flashlight
    ,private camera: Camera,private scanner: BarcodeScanner) {

  }
     
  startvibration(){
      
    this.vibration.vibrate([2000,1000,2000]);
  }
  
  startflash(){
    
    this.flashlight.switchOn();
    console.log(this);
   
  }
  stopflash(){
    this.flashlight.switchOff();
  }
  cameraon(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
  scan(){
    this.options={
    prompt: "scan your barcode"
    };
    this.scanner.scan(this.options).then((data) => {
    this.scannedData = data;
    }, (err) => {
    console.log('Error :',err);
    })
    }
    encode(){
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodText).then((data) =>{
    this.encodedData=data;
    },(err) => {
    console.log("Error :", err);
    })
    }
    }
    
   

