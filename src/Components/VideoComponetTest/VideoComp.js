// import CheckCameraPermission from "./Permissions";
import Camera from "./Camera";

class VideoCapture {
  constructor(element) {
    this.element = element;
    this.video = document.createElement("video");
    this.video.style = "display: none";
    this.video.muted = true;
    this.chunks = [];
  }
  cameraAccess(cb) {
    Camera({ audio: true, video: true })
      .then(stream => {
        cb(stream, null);
      })
      .catch(err => {
        cb(null, err);
      });
  }
  captureDataToCanvas(element, context) {
    const init_time = new Date();
    setInterval(() => {
      if (!this.video.paused) {
        context.drawImage(element, 0, 0, 500, 500);
        context.font = "20px serif";
        context.fillStyle = "white";
        let x = parseInt((new Date() - init_time) / 1000);
        let str =
          (parseInt(x / 3600) % 60) +
          " hours " +
          (parseInt(x / 60) % 60) +
          " mins " +
          (x % 60) +
          " secs";
        context.fillText(str, 0, 20, 300);
      }
    }, 0);
  }
  start() {
    this.cameraAccess((stream, err) => {
      if (!err) {
        this.stream = stream;
        this.video.srcObject = stream;
        const context = this.element.getContext("2d");
        const cStream = this.element.captureStream(30);
        cStream.addTrack(stream.getAudioTracks()[0]);
        this.video.onloadeddata = () => {
          this.video.play();
          this.captureDataToCanvas(this.video, context);
        };

        this.mediaRecorder = new MediaRecorder(cStream);
        this.startMediaRecorder();
      }
    });
  }
  startMediaRecorder() {
    this.mediaRecorder.start();
    this.mediaRecorder.ondataavailable = e => {
      this.chunks.push(e.data);
    };
  }
  pause() {
    this.video.pause();
    this.mediaRecorder.pause();
  }
  play() {
    this.video.play();
    this.mediaRecorder.resume();
  }
  stop(cb) {
    this.video.pause();
    this.mediaRecorder.stop();
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks);
      this.chunks = [];
      cb(blob);
    };
  }
}
export default VideoCapture;
