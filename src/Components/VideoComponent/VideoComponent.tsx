import React, { useEffect, useState } from "react";
import Video from "./Video";

export default function VideoComponent(): JSX.Element {
  const [video, setVideo] = useState<any>(null);
  useEffect(() => {
    setVideo(new Video(document.querySelector("canvas")!, {audio: true, video: true}));
  }, []);
  const checkPermissions = ()=>{
    video.cameraAccess((resp: any, err: any) => {
      if (err) {
        alert("Camera Permissions Denied");
      }
    });
  }
  const handleStart = () => {
    checkPermissions()
    video.start();
  };
  const handlePause = () => {
    video.pause();
  };
  const handlePlay = () => {
    video.play();
  };
  const handleStop = () => {
    video.stop((blob: Blob, err: any) => {
      if(!err){
        const player:any = document.querySelector("#player")!;
        player.src = window.URL.createObjectURL(blob);
      }
    });
  };
  return (
    <>
      <canvas width="500" height="500" />
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>
      <video id="player" autoPlay controls />
    </>
  );
}
