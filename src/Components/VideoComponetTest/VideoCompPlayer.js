import React, { useEffect, useState } from "react";
import VideoCapture from "./VideoCapture";

export default function VideoRecorderUsingCapture() {
  const [video, setVideo] = useState(null);
  useEffect(() => {
    setVideo(new VideoCapture(document.querySelector("canvas")));
  }, [video]);
  useEffect(() => {
    video.cameraAccess((resp, err) => {
      if (err) {
        alert("Camera Permissions Denied");
      }
    });
  });
  const handleStart = () => {
    video.start();
  };
  const handlePause = () => {
    video.pause();
  };
  const handlePlay = () => {
    video.play();
  };
  const handleStop = () => {
    video.stop(blob => {
      const player = document.querySelector("#player");
      player.src = window.URL.createObjectURL(blob);
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
