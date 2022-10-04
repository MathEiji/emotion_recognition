export class Frame {
    private videoId: String;
    private videoTime: Number;
    private imgBase64: String;
    private capturedAt: Date


    constructor(videoId: String, videoTime: Number, imgBase64: String, capturedAt: Date){
        this.videoId = videoId;
        this.videoTime = videoTime;
        this.imgBase64 = imgBase64;
        this.capturedAt = capturedAt;
    }
 }