import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { Backlight } from '@ionic-native/backlight';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import firebase from 'firebase';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  options: BarcodeScannerOptions;
encodText:string="";
encodedData:any={};
scannedData:any={};

  constructor(public navCtrl: NavController,private vibration: Vibration,private backlight: Backlight
    ,private camera: Camera,private scanner: BarcodeScanner,private fileChooser: FileChooser,private file: File,
  private platform : Platform) {

  }
     
  startvibration(){
      
    this.vibration.vibrate([2000,1000,2000]);
  }
 on(){
    this.backlight.on().then(() =>{
      this.backlightStatus =true;
     })
  }
  off(){
    this.backlight.off().then(() =>{
      this.backlightStatus =false;
     })
  }
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
choose(){
    this.fileChooser.open().then((uri)=>{
       alert(uri);
       this.file.resolveLocalFilesystemUrl(uri).then((newUrl)=>{
       alert(JSON.stringify(newUrl));
      
      let dirPath = newUrl.nativeURL;
      let dirPathSegments = dirPath.split('/')
      dirPathSegments.pop()
      dirPath = dirPathSegments.join('/')
      
      this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async(buffer)=>{
      await this.upload(buffer,newUrl.name); //buffer is content of file in fbase
      })
      })
      })
      }
      async upload(buffer,name){
      let blob = new Blob([buffer], {type:"image/jpeg"});
      
      let storage= firebase.storage();
      
      storage.ref('image/' + name).put(blob).then((d)=>{
      alert("done");
      }).catch((error)=>{
      alert(JSON.stringify(error))
      })
      } 
    }
    
   

