import React from 'react'
import { Barcode, BarcodePicker, ScanSettings, configure } from "scandit-sdk";

interface Configurations {
    license: string;
    playSoundOnScan?:boolean;
    vibrateOnScan?:boolean;
    element: any;
}

export default function ScanditReader(props: Configurations){
    const scanSettings = new ScanSettings({
        enabledSymbologies: [
          Barcode.Symbology.QR,
          Barcode.Symbology.MICRO_QR,
          Barcode.Symbology.EAN8,
          Barcode.Symbology.EAN13,
          Barcode.Symbology.UPCA,
          Barcode.Symbology.UPCE,
          Barcode.Symbology.CODE128,
          Barcode.Symbology.CODE39,
          Barcode.Symbology.CODE93,
          Barcode.Symbology.INTERLEAVED_2_OF_5,
          Barcode.Symbology.DATA_MATRIX,
          Barcode.Symbology.PDF417
        ],
        codeDuplicateFilter: 1000
      });
    return new Promise((resolve, reject)=>{
        configure(props.license, {
            engineLocation: process.env.PUBLIC_URL+'/Dependencies/'
        })
        BarcodePicker.create(props.element,{
            playSoundOnScan: props.playSoundOnScan,
            vibrateOnScan: props.vibrateOnScan
        })
        .then((barcodePicker: any)=>{
            barcodePicker.applyScanSettings(scanSettings);
            barcodePicker.on("scan", (scanResult: any) => {
                resolve(scanResult.barcodes.reduce((string: string, barcode: any) => {
                  return barcode;
                }, ""));
              });
        })
        .catch(err=>{
            reject(err)
        })
    })
}