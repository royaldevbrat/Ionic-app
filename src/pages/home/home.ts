import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { FileChooser } from '@ionic-native/file-chooser';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Flashlight } from '@ionic-native/flashlight';
import firebase from 'firebase';
import{storage,initializeApp} from 'firebase';
import { FingerprintAIO,FingerprintOptions } from '@ionic-native/fingerprint-aio';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact, ContactField, ContactName, ContactFieldType } from '@ionic-native/contacts';
import { BatteryStatus } from '@ionic-native/battery-status';
import { DomSanitizer } from '@angular/platform-browser';
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
isOn: boolean=true;
phoneNumber: number;


  
  constructor(public navCtrl: NavController,private vibration: Vibration,private flashlight: Flashlight,
    private camera: Camera,private scanner: BarcodeScanner,private fileChooser: FileChooser,private file: File,
  private platform : Platform,private faio: FingerprintAIO,private call: CallNumber,
  private contacts: Contacts,private batteryStatus: BatteryStatus,private sanitizer: DomSanitizer) {
    
    this.getStatus();
    }
     
  startvibration(){
      
    this.vibration.vibrate([2000,1000,2000]);
  }
  async isAvailable():Promise<boolean>{
    try{
    return await this.flashlight.available();
    }
    catch(e){
    console.log(e);
    }
    }
    
    async toggleFlash():Promise<void>{
    try{
    let available= await this.isAvailable();
    if(available){
      
    await this.flashlight.toggle();
   
    this.isOn=!this.isOn;
    }
    else{
    console.log("is not available");
    }
    }
    catch(e){
    console.log(e);
    }
    }
     
    async turnOnFlash(): Promise<void>{
    await this.flashlight.switchOn();
    }
    
    async turnOffFlash(): Promise<void>{
    await this.flashlight.switchOff();
    }
    async takephoto(){
      try{
      // defining camera options
      const options: CameraOptions = {
       quality: 50,
       targetHeight:600,
       targetWidth:600,
       destinationType: this.camera.DestinationType.DATA_URL,
       encodingType:this.camera.EncodingType.JPEG,
       mediaType: this.camera.MediaType.PICTURE,
       correctOrientation:true
      }
      const result = await this.camera.getPicture(options);
      const image = `data:image/jpeg;base64,${result}`;
      
      const pictures = storage().ref('pictures');
      pictures.putString(image,'data_url');
      
    }
      catch(e){
      console.error(e);
      }
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
    this.reset();
    },(err) => {
    console.log("Error :", err);
    })
    }
    reset(){
      this.encodText='';
    }
   /* choose(){
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
      alert('till here it worked')
      this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async(buffer)=>{
      await this.upload(buffer,newUrl.name); //buffer is content of file in fbase
      })
      })
      })
      }
      async upload(buffer,name){
      let blob = new Blob([buffer], {type:"image/jpeg"});
      
      let storage= firebase.storage();
      
      storage.ref('images/' + name).put(blob).then((d)=>{
      alert("done");
      }).catch((error)=>{
      alert(JSON.stringify(error))
      })
      } */
      
    
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
    
     contactList = [];

     getContacts(): void {
       this.contacts.find(
         ["displayName", "phoneNumbers","photos"],
         {multiple: true, hasPhoneNumber: true}
         ).then((contacts) => {
           for (var i=0 ; i < contacts.length; i++){
             if(contacts[i].displayName !== null) {
               var contact = {};
               contact["name"]   = contacts[i].displayName;
               contact["number"] = contacts[i].phoneNumbers[0].value;
               if(contacts[i].photos != null) {
                 console.log(contacts[i].photos);
                 contact["image"] = this.sanitizer.bypassSecurityTrustUrl(contacts[i].photos[0].value);
                 console.log(contact);
               } else {
                 contact["image"] = "assets/dummy-profile-pic.png";
               }
               this.contactList.push(contact);
             }
           }
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
