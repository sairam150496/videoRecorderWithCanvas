import React, { useEffect, useState } from 'react';
import './App.css';
// import ScanditReader from './Components/ScanditReader/Components/ScanditReader';
// import Video from './Components/VideoInput/Video';
import VideoComponent from './Components/VideoComponent/VideoComponent';
// import Recorder from './Components/Recorder/Recorder';


// const [response, setResponse] = useState<any>(null)
//   useEffect(()=>{
//     if(navigator.mediaDevices.getUserMedia || navigator.mediaDevices){
//       navigator.mediaDevices.getUserMedia({video: true})
//       .then(stream=>{
//         const video = document.querySelector('video')!
//         video.srcObject = stream
//         video.onloadedmetadata = ()=>{
//           video.play()
//         }
//       })
//     }
//   })
//   useEffect(()=>{
//     const video = document.querySelector('video')
//     ScanditReader({license: "ASUeXxPuDZDoDPieWDH34qkryRvAL5DUklLQ7QVehso8CNI5OwO5LphEZXmaeGnRoG+8IHBYeT7eTDX+pFONT9RLsua6e/UyNhFm63RyW3orVwCDLmYv/HY9XyHlJ5WPKgm6pG9k+188vW0NpQ6SNopCzYWSXIxPTQC3ozgoSRPAIuAOo7qMau9PabN7PiBh1rbcUp2uvO8ZDnG6euXd5555E9aLE7fJEulIMQVkbY8yNj/mulGmrq+DXyvT2nE9IpWYH6FUcUuUnv5EMey2nmuYuYuC5ZIuipeoz0IMosmWzWdmQAs1ObBKmtga+qsthpaTejzg1WosHx6T1h6iZEo7CXyDp31RokZo/lboZPkdY+Va6JMBjR4BNWICEqA9i3KfDK5t9mDjNLBXiFEBw2CXloAz5PwuIdU/l9rmRIlaj13bx6gxv0nZLCIYxbVFnCFr/nglAAJ5LcxXmE3oMt7dzpCZBzALzfOz8X6RwO3JyLBhOBf5LnRmMInFosStJgSevYXCoLeHMe0huKAZrE2GwpcOzNlTBE1CdU5EfbVbFPP2fTBO+WZLI+LCGfCtuAGlxhopW5Wq/7F2h1hi1kr567vj8ed8dpsHafViWqaa8LIoXkRfEY69hAD8jkB08+9fBQfwEzPlZt/f1DQCAUkZGrowfDCnyidi83k8vf3W2NZtogP/XCdA9J11EOO77ZkDHahMP+SJk7vHzR1AzvLtaVTXRwT+snaxdGKPZxCddYELj6D02Kh0bR4CF1P+EAbilrwGADcSC3XUnIZc1j1X17WpyFxNpY5+uorfynWcKF8/aw==", element: video, playSoundOnScan: true, vibrateOnScan: true})
//         .then((resp: any)=>{
//           setResponse(resp)
//           console.log(resp)
//         })
//         .catch(err=>{
//           console.log(err)
//         })
//   }, [response])
//   return (
//     <>
//     <video id="#barcode" />
//     </>
//   );


function App() {
  return(
  <><VideoComponent /></>
  )
}

export default App;
