import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements OnInit {
  value = 'Clear me';
  iFrameUrl: SafeResourceUrl | undefined;
  url: string = "";

  private apiLoaded = false;
  
  @Input() videoId!: string;

  ngOnInit(){
    window.addEventListener("DOMContentLoaded", this.openCamera);
  }

  openCamera() {

      navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{
        const videoElement: HTMLMediaElement = document.querySelector("#webcam-video")!;
        videoElement.srcObject = stream;

      })

  }
}

