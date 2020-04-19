import React, { useEffect, useState, useRef } from 'react'


export default function Recorder(): JSX.Element{
    const [stream, setStream] = useState<MediaStream|null>(null)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder|null>(null);
    const [chunks, setChunks] = useState<Array<any>>([])
    const videoElement = useRef<any>(null)
    const timeInterval = useRef<any>(null)
    useEffect(()=>{
        if(!stream){
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream=>{
                setStream(stream)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }, [stream])
    useEffect(()=>{
        if(mediaRecorder){
            mediaRecorder.start()
            mediaRecorder.ondataavailable= (e: any)=>{
                setChunks((chunk: Array<any>)=>{
                    let arr = chunk
                    console.log(chunk)
                    arr.push(e.data)
                    return arr
                })  
            }
        }
    }, [mediaRecorder])

    const handleStart = ()=>{
        const video = document.querySelector('video')!
        videoElement.current = video
        video.srcObject = stream!
        const canvas:any = document.querySelector('canvas')!
        video.onloadedmetadata = ()=>{
            const context = canvas.getContext('2d')!
            video.play()
            timeInterval.current = setInterval(()=>{
                context.drawImage(video, 0, 0, 500, 500)
                context.font = "30px Arial";
                context.fillText(new Date().toString(), 0, 100);
            }, 0)            
        }
        setMediaRecorder(new MediaRecorder(canvas.captureStream(30)))
    }
    const handleStop = ()=>{
        videoElement.current.pause()
        mediaRecorder?.stop()
        if(mediaRecorder)
        mediaRecorder.onstop = ()=>{
            console.log(chunks)
            const blob = new Blob(chunks)
            const player:any = document.getElementById('player')
            player.src = window.URL.createObjectURL(blob) 

        }
    }
    return(
        <>
        <video width="500" height="500"/>
        <canvas width="500" height="500"/>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <video id="player" autoPlay></video>
        </>
    )
}
