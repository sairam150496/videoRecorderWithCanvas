import React, { useState, useEffect, useRef } from 'react'
import Camera from '../Camera/Components/Camera'

export default function Video():JSX.Element{
    const [stream, setStream] = useState<MediaStream|null>(null)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder|null>(null)
    const [chunks, setChunks] = useState<Array<Blob|BlobPart>>([])
    const video = useRef<any>(null)

    useEffect(()=>{ 
        Camera({audio: {echoCancellation: true, noiseSuppression: false, autoGainControl: false}, video: true})
        .then((stream: any)=>{
           const mediaStream: MediaStream = stream
            setStream(mediaStream)
        })
        .catch(err=>{
            setStream(null)
            if(err === 'denied'){
                alert("Camera Permissions Denied")
            }else if(err === "Not A Https call"){
                alert("Camera Support only on HTTPS Requests");
            }else if(err === "Old Browser"){
                alert("This Application Runs on Browsers That Support HTML5 Contents");
            }
        })
    },[])
    useEffect(()=>{
        if(mediaRecorder){
            mediaRecorder.start()
            mediaRecorder.ondataavailable = (e: any)=>{
                setChunks((chunk:Array<any>)=>{
                    chunk.push(e.data)
                    return chunk
                })
        }
    }
    }, [mediaRecorder])

    const handlePlay = ()=>{
        const video_rec = document.querySelector('video')!
        video.current = video_rec
        if(stream){
        video_rec.srcObject = stream
        video_rec.onloadedmetadata = ()=>{
            video_rec.play()
        }
        const tracks = stream.getAudioTracks()[0]
        tracks.applyConstraints({autoGainControl: false, echoCancellation: false})
        console.log(tracks.getSettings())   
        setMediaRecorder(new MediaRecorder(stream))
    }
    }
    const handleStop = ()=>{
        video.current.pause()
        if(mediaRecorder){
        mediaRecorder.stop()
        mediaRecorder.onstop = ()=>{
        const blob = new Blob(chunks!)
        const player: any = document.querySelector('#player')!
        player.src = window.URL.createObjectURL(blob)
        setChunks([])
        }
    }        
    }

    return(
        <>
        <video muted/>
        <video id="player" controls autoPlay/>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handleStop}>Stop</button>
        </>
    )
}