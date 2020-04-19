import CheckCameraPermission from './Permissions'

interface Constraints{
    audio?: boolean | MediaTrackConstraints;
    video?: boolean | MediaTrackConstraints;
}
export default function Camera(constraints: Constraints){
    return new Promise((resolve, reject)=>{
        CheckCameraPermission()
        .then(resp=>{
            if(resp === "granted" || resp === "Not A Chrome Browser"){
                if(navigator.mediaDevices.getUserMedia && navigator.mediaDevices){
                    navigator.mediaDevices.getUserMedia(constraints)
                    .then((stream: MediaStream)=>{
                        resolve(stream)
                    })
                    .catch(err=>{
                        reject("denied")
                    })
                }
            }else{
                reject(resp)
            }
        })
        .catch(err=>{
            reject(err)
        })
    })
}
