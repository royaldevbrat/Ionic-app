import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { FileChooser } from '@ionic-native/file-chooser';
import { Backlight } from '@ionic-native/backlight';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import firebase from 'firebase';
import { FingerprintAIO,FingerprintOptions } from '@ionic-native/fingerprint-aio';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact, ContactField, ContactName, ContactFieldType } from '@ionic-native/contacts';
import { BatteryStatus } from '@ionic-native/battery-status';
declare var cordova;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
  
})

export class HomePage {
  stat;
  fingerprintOptions:FingerprintOptions;
  options: BarcodeScannerOptions;
encodText:string="";
encodedData:any={};
scannedData:any={};
backlightStatus:boolean=false;
phoneNumber: number;
wheretosearch: ContactFieldType[] = ["displayName"];
q='';
contactFound =[];

  
  constructor(public navCtrl: NavController,private vibration: Vibration,private backlight: Backlight
    ,private camera: Camera,private scanner: BarcodeScanner,private fileChooser: FileChooser,private file: File,
  private platform : Platform,private faio: FingerprintAIO,private call: CallNumber,
  private contacts: Contacts,private batteryStatus: BatteryStatus) {
    this.search('');
    this.getStatus();
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
       // Check If Cordova/Mobile
//   if (this.platform.is('cordova')) {
   // window.location.href = "www.youtube.com";
   //alert("is available")
//}else{
   // window.open("www.youtube.com",'_blank');
  // alert("'is not available")
//}

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
      
    
    fingerprintdialoge(){
      this.faio.show({
        clientId: 'Fingerprint-demo',
        clientSecret: 'password'
        })
        .then(result => {
         this.navCtrl.setRoot('HomePage');
        
        })
        .catch(err => {
        console.log('Err:',err);
        })
    }
    async callNumber():Promise<any>{
      try{
       await this.call.callNumber(String(this.phoneNumber), true);
     }
     catch(e){
       console.error(e);
     }
     }
     search(val) {
       this.contacts.find(this.wheretosearch,{filter:this.q}).then((contacts) =>{
         this.contactFound = contacts;
       }).catch((err) =>{
          alert(JSON.stringify(err));
       })
       }
       ringerstatus(){
        cordova.plugins.ringerMode.getRingerMode(function(ringerMode) {
          console.log("The current ringerMode is:" + ringerMode);
    });
       }
       getStatus(){
        this.batteryStatus.onChange().subscribe(status=> {
          this.stat = status;
      });
      }
     }
  

// run command:
//  ionic cordova run android   
