import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { Frame } from '../model/Frame';
import { FrameService } from '../service/FrameService';

import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs-backend-webgl';

@Component({
  selector: 'app-video-capture',
  templateUrl: './video-capture.component.html',
  styleUrls: ['./video-capture.component.css'],
})
export class VideoCaptureComponent implements OnInit {

  value = 'Clear me';

  url: string = '';

  videoId: string = '';

  player: undefined | YT.PlayerEvent;

  videoElement: HTMLVideoElement | null = null;

  predictions: any;

  model: any;

  constructor(protected _sanitizer: DomSanitizer, private frameService: FrameService) {}

  async ngOnInit(): Promise<void> {
    this.model = await blazeface.load();
    window.addEventListener('DOMContentLoaded', this.openCamera);
  }

  openCamera() {
    navigator.mediaDevices.getUserMedia({ video: {facingMode: {exact: "right"}} }).then((stream) => {
      this.videoElement = document.querySelector('#webcam-video')!;
      this.videoElement.srcObject = stream;
    });
  }

  savePlayer(player: YT.PlayerEvent) {
    this.player = player;
    timer(0, 3000).subscribe(async () => {
      if (this.player != undefined) { 
        const videoTime = this.player.target.getCurrentTime();
        console.log(videoTime);        
        this.takeSnapshot(videoTime);
      }
    });
  }

  async takeSnapshot(videoTime: Number) {
	  //Captura elemento de vídeo
    const video = document.querySelector<HTMLVideoElement>("#webcam-video");

    if(video != null){
      //Criando um canvas que vai guardar a imagem temporariamente
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      this.predictions = await this.model.estimateFaces(video, false);
      console.log(this.predictions);

      
      const ctx = canvas.getContext('2d');
      if (ctx != null) {
      	//Desenhando e convertendo as dimensões
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    	//Criando o JPG
      var imgBase64 = canvas.toDataURL('image/jpeg');
      //Gerar Imagem e Salvar Caminho no Banco
	    this.sendSnapShot(imgBase64, videoTime);
    }
  }

  sendSnapShot(imgBase64: String, videoTime: Number) {
    const frame = new Frame(this.videoId, videoTime, imgBase64, new Date());
    this.frameService.saveFrame(frame).subscribe(result => {
      console.log(result);
    });
  }

  onStateChange(event: any) {
    console.log(event);
  }

  onChangedIFrame() {
    this.videoId = this.url;
  }

  onChangeUrl(event: any) {
    this.url = this.getVideoIdByUrl(event.target.value);
  }

  private getVideoIdByUrl(url: string): string {
    return url.substring(url.indexOf('=') + 1);
  }
}
