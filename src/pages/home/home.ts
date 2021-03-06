import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { FileChooser } from '@ionic-native/file-chooser';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Flashlight } from '@ionic-native/flashlight';
import firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import{storage,initializeApp} from 'firebase';
import { FingerprintAIO,FingerprintOptions } from '@ionic-native/fingerprint-aio';
import { CallNumber } from '@ionic-native/call-number';
import { Contacts, Contact, ContactField, ContactName, ContactFieldType } from '@ionic-native/contacts';
import { BatteryStatus } from '@ionic-native/battery-status';
import { DomSanitizer } from '@angular/platform-browser';
declare var cordova;
declare var window:any;
declare var google;

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
public show:boolean = false;
public buttonName:any = 'Show contacts';
public Fbref:any;
lat: any;
lng:any;
Destination: any = '';
MyLocation: any;
public date: string = new Date().toISOString();

  constructor(public navCtrl: NavController,private vibration: Vibration,private flashlight: Flashlight,
    private camera: Camera,private scanner: BarcodeScanner,private fileChooser: FileChooser,private file: File,
    private platform : Platform,private faio: FingerprintAIO,private call: CallNumber,
    private contacts: Contacts,private batteryStatus: BatteryStatus,private sanitizer: DomSanitizer,private geo: Geolocation) {
    
    this.getStatus();
    this.Fbref=firebase.storage().ref();
    }

   vibrate(e){
   //  alert(e.target.value);
     if(e.target.value=="startvibration")
     {
       //alert('line 59');
       this.startvibration();
       return
     }
     else if (e.target.value=="upload")
     {
       //alert('line 63');
      this.choose();
       return
     }
     else if (e.target.value=="takephoto")
     {
      // alert('line 68');
       this.takephoto();
       return
     }
  
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
      const pictures = storage().ref('pictures/myphotos');
      pictures.putString(image, 'data_url');
      
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
    choose(){
      const options={
        sourceType:this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType:this.camera.MediaType.ALLMEDIA,
        destinationType:this.camera.DestinationType.FILE_URI
       }
       this.camera.getPicture(options).then(fileuri=>{
        window.resolveLocalFileSystemURL("file://"+fileuri,FE=>{
        FE.file(file=>{
        const FR=new FileReader()
        FR.onloadend=(res:any)=>{
        let AF=res.target.result
        let blob=new Blob([new Uint8Array(AF)],{type:'video/mp4'})
        this.upload(blob)
       
        };
        FR.readAsArrayBuffer(file);
        
        })
        })
        })
        upload(blob:Blob){
          this.Fbref.child('vid').put(blob);
          alert('uploaded');
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
     toggle() {
      this.show = !this.show;
  
      // CHANGE THE NAME OF THE BUTTON.
      if(this.show)  
        this.buttonName = "Hide Contact";
      else
        this.buttonName = "Show Contact";
    }

       getStatus(){
        this.batteryStatus.onChange().subscribe(status=> {
          this.stat = status;
      });
      }
      ionViewDidLoad(){
        this.geo.getCurrentPosition().then( pos => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        }).catch(err => alert(err));
        
        }
        calculateAndDisplayRoute() {
          let that = this;
          let directionsService = new google.maps.DirectionsService;
          let directionsDisplay = new google.maps.DirectionsRenderer;
          const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: {lat: 41.85, lng: -87.65}
          });
          directionsDisplay.setMap(map);
      
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              
              map.setCenter(pos);
              that.MyLocation = new google.maps.LatLng(pos);
      
            }, function() {
              
            });
          } else {
            // Browser doesn't support Geolocation
          }
      
          directionsService.route({
          origin: this.MyLocation,
          destination: this.Destination,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }   
      saveLocation(){
        firebase.database().ref('map/location').update({
          lat: this.lat,
           lng: this.lng,
            date:this.date
          // currDate=new Date().toISOString()
        }).then(res =>{
          // THE LOCATION IS SAVED, DO YOUR STUFF
        })
      }   
      
     showDiv() {
        document.getElementById('map').style.display = "block";
     }
     hideDiv() {
      document.getElementById('map_canvas').style.display = "block";
   }
     initialize() {
      var infowindow = new google.maps.InfoWindow();
      var map = new google.maps.Map(
        document.getElementById("map_canvas"), {
          center: new google.maps.LatLng(37.4419, -122.1419),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var locationsRef = firebase.database().ref('map/location');
        var bounds = new google.maps.LatLngBounds();
        locationsRef.on('child_added', function(snapshot) {
          var data = snapshot.val();
          console.log(data);
          var marker = new google.maps.Marker({
            position: {
              lat: parseFloat(data.lat),
              lng: parseFloat(data.lng)
            },
            map: map
          });
          bounds.extend(marker.getPosition());
          marker.addListener('click', (function(data) {
            return function(e) {
              infowindow.setContent(data.name + "<br>" + this.getPosition().toUrlValue(6) + "<br>" + data.message);
              infowindow.open(map, this);
            }
          }(data)));
          map.fitBounds(bounds);
        });
      }
      // google.maps.event.addDomListener(window, "load", initialize); 
      
      } 
      //  google.maps.event.addDomListener(window, "load", initialize); 
  
 
