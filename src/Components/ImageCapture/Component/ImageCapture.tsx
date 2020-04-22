class ImageCaptureStream{
    track: MediaStreamTrack;
    imageCapture: ImageCapture
    constructor(track: MediaStreamTrack){
        this.track = track
        this.imageCapture = new ImageCapture(track)
    }


    getPhotoCapabilities(){
        return new Promise((resolve, reject)=>{
            this.imageCapture.getPhotoCapabilities()
            .then(photoCapbilities=>{
                resolve({
                    redEyeReduction: photoCapbilities.redEyeReduction,
                    imageHeight: {
                        min: photoCapbilities.imageHeight.min,
                        max: photoCapbilities.imageHeight.max,
                        step: photoCapbilities.imageHeight.step,
                    },
                    imageWidth: {
                        min: photoCapbilities.imageWidth.min,
                        max: photoCapbilities.imageWidth.max,
                        step: photoCapbilities.imageWidth.step,
                    },
                    fillLight: photoCapbilities.fillLightMode
                })
            })
            .catch(err=>{
                reject(err)
            })
        })
    }

    getPhotoSettings(){
        return new Promise((resolve, reject)=>{
            this.imageCapture.getPhotoSettings()
            .then(photoSetting=>{
                resolve({
                    redEyeReduction: photoSetting.redEyeReduction,
                    imageHeight: photoSetting.imageHeight,
                    imageWidth: photoSetting.imageWidth,
                    fillLight: photoSetting.fillLightMode
                })
            }).catch(err=>{
                reject(err)
            })
        }) 
    }

    takePhoto(photoSetting: any){
        return new Promise((resolve, reject)=>{
            this.imageCapture.takePhoto(photoSetting)
            .then(blob=>{
                resolve(blob);
            })
            .catch(err=>{
                reject(err)
            })
        })
    }

    
}
export default ImageCaptureStream