import Camera from '../Camera/Components/Camera'
import Constraints from '../Camera/Components/Interfaces';
import ImageCaptureStream from '../ImageCapture/Component/ImageCapture';



interface takePhoto{
  fillLightMode: "auto"|"flash"|"off";
  imageHeight: number;
  imageWidth: number;
  redEyeReduction: boolean;
}

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

interface GetTime{
  format?:"mins"|":";
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
    init_time: Date;
    canvasContext: any;


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
    this.canvasContext = null;
  }


  __dir__(){
    return({
      Constraint: "Constraint is the feature that is supported by the device, eg: zoom, flash etc.",
      cameraAccess: "Accepts a call back with response and error as input parameters, if permissions denied returns error else returns granted",
      start: "Starts the video stream, it takes a callback with a parameter context, this context is the canvas context",
      stop: "It takes a callback with blob as input, this blob is the recorded video blob blob",
      pause: "This function will pause the video",
      play: "This function will resume the video",
      doesSupportConstraint: "This method takes the constraints array and returns true if contraint is supported by the device else returns false",
      getAllContraints: "An Array that gives all constraints that are supported in HTML5",
      getSupportedConstraints: "It returns all the constraints that are supported by device",
      getConstraintValues: "This returns the values of the mentioned constraints",
      getPhotoSettings: "This Returns the applicable settings for an image",
      takePhoto: "Accepts a callback with blob as input, this blob is an image captured from video stream",
      getMediaTrackCapabilityRangeSettings: "This returns the max, min, step values for the mentioned capability, eg: zoom has min as 1, max as 8 and step as 0.1",
      setColorTemerature: "Sets the color temperature, min,max,step are 2850, 7000, 50",
      setExposure: "Takes the expore value and sets it to the video, min, max, step are -2,2,0.2",
      torch: "Takes bolean as input, if true flash will be set to on state and if false it is set to off state",
      getCapabilities: "returns Image capabilities",
      setZoom: "Takes zoom and sets the value to the video. default min, max and step values are 0, 8, 0.1",
      getTime: "This returns a video record timer"
    })
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

  /*

    * Returns TRUE if the device supports the feature / Constraint

  */

  doesSupportConstraint(constraint: Array<string>) {
      try{
      let obj:any = {}
      constraint.forEach((item, index)=>{
        obj[item] = item in this.stream!.getVideoTracks()[0].getCapabilities()?true:false;
      })
      return obj;
    }
    catch(e){
      return null
    }
  }


getAllContraints(){
  return ([
    "aspectRatio",
    "autoGainControl",
    "brightness",
    "channelCount",
    "colorTemperature",
    "contrast",
    "deviceId",
    "echoCancellation",
    "exposureCompensation",
    "exposureMode",
    "exposureTime",
    "facingMode",
    "focusDistance",
    "focusMode",
    "frameRate",
    "groupId",
    "height",
    "iso",
    "latency",
    "noiseSuppression",
    "pointsOfInterest",
    "resizeMode",
    "sampleRate",
    "sampleSize",
    "saturation",
    "sharpness",
    "torch",
    "whiteBalanceMode",
    "width",
    "zoom"
  ]);
}

/*

* This Returns All The Supported Constraints

*/

  getSupportedConstraints(){
    try{
      let obj: any = {}
      const cap: any = this.stream!.getVideoTracks()[0].getCapabilities();
        Object.keys(cap).forEach((item, index)=>{
          obj[item] = cap[item]
        })
        return obj
      }catch(e){
        return null
      }
  }

  /*

  * This Returns Mentioned Constraint Values

*/

  getConstraintValues(constraint: Array<string>) {
    let obj:any = {}
    const cap:any = this.stream!.getTracks()[0].getCapabilities()
    constraint.forEach((item, index)=>{
      obj[item] = cap[item]
    })
    return obj;    
  }

 /*

  * This returns the flashlight info, imageHeight, image width etc

*/


  getPhotoSettings(cb: Function) {
    try{
      new ImageCaptureStream(this.stream!.getVideoTracks()[0])
      .getPhotoSettings()
      .then(photoCap => {
        cb(photoCap, null);
      })
      .catch(err => {
        cb(null, err);
      });
    }catch(e){
      cb(null, e)
    }
  }

  /*

  * This returns the flashlight info, imageHeight, image width etc

*/

  takePhoto(props: takePhoto, cb: Function) {
    try{
      new ImageCapture(this.stream!.getVideoTracks()[0])
      .takePhoto(props)
      .then(blob => {
        cb(blob, null);
      })
      .catch(err => {
        cb(null, err);
      });
    }catch(e){
      cb(null, e)
    }
    
  }

  /*

  * This returns the min, max and step values of the capability that mentioned in the array.
  * EX: colorTemperature, exposureCalibration etc 

*/

  getMediaTrackCapabilityRangeSettings(capability: Array<string>) {
    if (this.stream) {
      let obj: any = {}
      const cap: any = this.stream!.getVideoTracks()[0].getCapabilities();
      capability.forEach((item, index)=>{
        obj[item] = {
          min: cap[item].min,
          max: cap[item].max,
          step: cap[item].step
        }
      })
      return obj;
    } else {
      return null;
    }
  }

  setColorTemerature(temp: number){
    try{
      const colorTempSettings = this.getMediaTrackCapabilityRangeSettings(["colorTemperature"]).colorTemperature
      if(this.stream){
        if(temp<colorTempSettings.min){
          temp = colorTempSettings.min
        }else if(temp> colorTempSettings.max){
          temp = colorTempSettings.max
        }
        this.stream.getVideoTracks()[0].applyConstraints({
          advanced:[{
            colorTemperature: temp
          }]
        })
        return null
      }
    }catch(e){
      return e
    }
  }

  setExposure(temp: number){
    try{
      const colorTempSettings = this.getMediaTrackCapabilityRangeSettings(["exposureCompensation"]).colorTemperature
      if(this.stream){
        if(temp<colorTempSettings.min){
          temp = colorTempSettings.min
        }else if(temp> colorTempSettings.max){
          temp = colorTempSettings.max
        }
        this.stream.getVideoTracks()[0].applyConstraints({
          advanced:[{
            exposureCompensation: temp
          }]
        })
        return null
      }
    }catch(e){
      return e
    }
  }

  torch(mode: boolean){
    try{
        const tracks:any = this.stream!.getVideoTracks()[0];
        tracks.applyConstraints({advanced:[{
          torch: mode
        }]})
        return null;
      }
      catch(e){
        return e
      }
  }

/*

* This Returns the following information,

Flash Mode- "AUTO (or) ON (or) OFF"
imageWidth
ImageHeight
redEyeReduction

*/


getCapabilities(){
  try{
    return new ImageCaptureStream(this.stream!.getVideoTracks()[0]).getPhotoCapabilities();
  }
  catch(e){
    return e;
  }
  
}


  setZoom(zoom: number) {
    try{
      if (this.stream) {
        const tracks:any = this.stream.getVideoTracks()[0];
        const capabilities:any = tracks.getCapabilities();
        if ("zoom" in capabilities) {
          if (zoom >= capabilities.zoom.max) {
            // alert("Set to max zoom");
            zoom = capabilities.zoom.max
          } else if (zoom <= capabilities.zoom.min) {
            // alert("Set to Min Zoom");
            zoom = capabilities.zoom.min
          }
          tracks.applyConstraints({ advanced: [{ zoom: zoom }] });
          this.stream.addTrack(tracks);
        
        } else {
          alert("Zoom is Not Supported on this Device");
        }
      }
      return null
    }
    catch(e){
      return e
    }
    
  }


  getTime(props: GetTime): string{
    let x: number = Math.round(((this.pausedDate.getTime() - this.init_time.getTime()) - this.pausedTime) / 1000);
    if(props.format === "mins"){
      return(
          (Math.floor(x / 3600) % 60) +
          " hours " +
          (Math.floor(x / 60) % 60) +
          " mins " +
          Math.floor(x % 60) +
          " secs");
    }else{
      return ((Math.floor(x / 60) % 60) +
        ":" +
        Math.floor(x % 60));
    }
  }


  captureDataToCanvas(cb: Function) {
    this.init_time = new Date();
    setInterval(() => {
      if (!this.video.paused) {
        this.canvasContext.drawImage(this.video, 0, 0, this.element.width, this.element.height);
        this.pausedDate = new Date()
        cb(this.canvasContext)
      }else{
          if(!this.stoped){
            this.pausedTime = Math.round(new Date().getTime() - this.pausedDate.getTime())
          }else{
              this.pausedTime = 0;
          }
          
      }
    }, 0);
  }


  start(cb:Function|null=null) {
    this.cameraAccess((stream: MediaStream, err: any) => {
      if (!err) {
        this.stream = stream;
        this.video.srcObject = stream;
        const context = this.element.getContext("2d");
        this.canvasContext = context
        const cStream = this.element.captureStream(30);
        cStream.addTrack(stream.getAudioTracks()[0]);
        this.video.onloadeddata = () => { 
          this.video.play();
          this.stoped = false;
          this.captureDataToCanvas(cb?cb:()=>{

          });
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
