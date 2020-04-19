import React, { useState, useEffect, useRef } from "react";
// import Camera from '../Camera/Components/Camera'

export default function Video() {
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const video = useRef(null);
  const init_time = useRef(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: { width: 500, height: 500 } })
      .then(stream => {
        setStream(stream);
      })
      .catch(er => {
        alert("Require Camera Permissions");
      });
  }, []);
  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.start();
      mediaRecorder.ondataavailable = e => {
        setChunks(chunk => {
          chunk.push(e.data);
          return chunk;
        });
      };
    }
  }, [mediaRecorder]);
  const draw = (context, element) => {
    init_time.current = new Date();
    setInterval(() => {
      if (!video.current.paused) {
        context.drawImage(element, 0, 0, 500, 500);
        context.font = "20px serif";
        context.fillStyle = "white";
        let x = parseInt((new Date() - init_time.current) / 1000);
        let str =
          (parseInt(x / 3600) % 60) +
          " hours " +
          (parseInt(x / 60) % 60) +
          " mins " +
          (x % 60) +
          " secs";
        context.fillText(str, 0, 50, 300);
      }
    }, 0);
  };
  const handlePlay = () => {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    const video_rec = document.querySelector("#recorder");
    video.current = video_rec;
    video_rec.srcObject = stream;
    video_rec.onloadedmetadata = () => {
      video_rec.play();
      draw(context, video_rec);
    };
    const stream2 = canvas.captureStream(30);
    stream2.addTrack(stream.getAudioTracks()[0]);
    // console.log("canvas steam", canvas.captureStream(25));
    setMediaRecorder(new MediaRecorder(stream2));
  };
  const handleStop = () => {
    video.current.pause();
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks);
        const player = document.querySelector("#player");
        player.src = window.URL.createObjectURL(blob);
        setChunks([]);
      };
    }
  };

  return (
    <>
      <video muted id="recorder" style={{ display: "none" }} />
      <canvas width="500" height="500" />

      <video id="player" controls autoPlay />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>
    </>
  );
}
