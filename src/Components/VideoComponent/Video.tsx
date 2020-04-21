import Camera from '../Camera/Components/Camera'
import Constraints from '../Camera/Components/Interfaces';

interface VideoProperties{
    font?: string;
    color?: string;
    time?: boolean;
    timeFormat?:[":", "mins"];
    timeX?: number;
    timeY?: number;
    timeLength?: number;
    text?: string;
    textX?: number;
    textY?: number;
    textLength?: number;
    zoomLevels?: number;
    zoomLevel?: number;
}

class Video implements Constraints {

    element: any;
    video: any;
    chunks: Array<Blob|BlobPart>;
    cameraConstraints: Constraints;
    pausedTime: number;
    pausedDate: Date;
    stream: MediaStream|null;
    videoProperties: VideoProperties;
    mediaRecorder: MediaRecorder | null;
    stoped: boolean;
    init_time: Date


  constructor(element: HTMLCanvasElement, cameraConstraints: Constraints, videoProperties: VideoProperties|null=null) {
    this.element = element;
    this.video = document.createElement("video");
    this.video.style = "display: none";
    this.videoProperties = videoProperties!;
    this.cameraConstraints = cameraConstraints;
    this.video.muted = true;
    this.pausedTime = 0;
    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];
    this.pausedDate = new Date();
    this.stoped = false;
    this.init_time = new Date();
  }

  cameraAccess(cb: Function) {
    Camera(this.cameraConstraints)
      .then(stream => {
        cb(stream, null);
      })
      .catch(err => {
        cb(null, err);
      });
  }
  captureDataToCanvas(element: HTMLVideoElement, context: any) {
    this.init_time = new Date();
    console.log(this.init_time)
    console.log(this.pausedTime)
    console.log(this.pausedDate)
    setInterval(() => {
      if (!this.video.paused) {
        context.drawImage(element, 0, 0, this.element.width, this.element.height);
        context.font = "20px serif";
        context.fillStyle = "white";
        this.pausedDate = new Date();
        let x: number = Math.round(((this.pausedDate.getTime() - this.init_time.getTime())- this.pausedTime ) / 1000);
        // console.log('X: ',x)
        console.log("init_time", this.init_time)
        console.log('pauseTime', this.pausedDate)
        console.log((+this.pausedDate.getTime() - +this.init_time.getTime())/1000)
        let str: string =
          (Math.floor(x / 3600) % 60) +
          " hours " +
          (Math.floor(x / 60) % 60) +
          " mins " +
          Math.floor(x % 60) +
          " secs";
        let str2: string = (Math.floor(x / 60) % 60) +
        ":" +
        Math.floor(x % 60);
        context.fillText(str, 0, 20, 300);
      }else{
          if(!this.stoped){
            this.pausedTime = Math.round(new Date().getTime() - this.pausedDate.getTime())
          }else{
              this.pausedTime = 0;
          }
          
      }
    }, 0);
  }
  start() {
    this.cameraAccess((stream: MediaStream, err: any) => {
      if (!err) {
        this.stream = stream;
        this.video.srcObject = stream;
        const context = this.element.getContext("2d");
        const cStream = this.element.captureStream(30);
        cStream.addTrack(stream.getAudioTracks()[0]);
        this.video.onloadeddata = () => { 
          this.video.play();
          this.stoped = false;
          this.captureDataToCanvas(this.video, context);
        };

        this.mediaRecorder = new MediaRecorder(cStream);
        this.startMediaRecorder();
      }
      else{
          alert("Camera Permissions Denied")
      }
    });
  }
  startMediaRecorder() {
    this.mediaRecorder!.start();
    this.mediaRecorder!.ondataavailable = e => {
      this.chunks.push(e.data);
    };
  }
  pause() {
    try{
        this.video.pause();
    this.mediaRecorder!.pause();
    }catch(e){
        alert("Video is Already Paused")
    }
  }
  play() {
      try{
        this.video.play();
        this.mediaRecorder!.resume();
      }catch(e){
          alert("Video is Already Playing")
      }
    
  }
  stop(cb: Function) {
      try{
        this.video.pause();
        this.stoped = true;
        this.mediaRecorder!.stop();
        this.mediaRecorder!.onstop = () => {
        const blob = new Blob(this.chunks);
        this.chunks = [];
        cb(blob, null);
      }
      }catch(e){
        cb(null, e)
    };
  }
}
export default Video;
